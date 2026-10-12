const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'students.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function loadStudents() {
  ensureDataFile();
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (e) {
    console.error('[StudentStore] Error reading students.json:', e);
    return [];
  }
}

function persistStudents(students) {
  ensureDataFile();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2), 'utf-8');
  } catch (e) {
    console.error('[StudentStore] Error writing students.json:', e);
  }
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function wrapStudent(s) {
  if (!s) return null;
  const wrapped = { ...s };

  // Ensure _id exists and has toString()
  if (!wrapped._id) {
    wrapped._id = 'std_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  }
  const idStr = String(wrapped._id);
  wrapped._id = {
    toString: () => idStr,
    valueOf: () => idStr,
    toJSON: () => idStr,
  };

  wrapped.save = async function () {
    const students = loadStudents();
    const idx = students.findIndex((item) => String(item._id) === idStr || item.regdNo === wrapped.regdNo);
    const serialized = {
      ...wrapped,
      _id: idStr,
      updatedAt: new Date().toISOString(),
    };
    if (idx >= 0) {
      students[idx] = serialized;
    } else {
      students.push(serialized);
    }
    persistStudents(students);
    return wrapped;
  };

  return wrapped;
}

function stripFields(item, projection) {
  if (!item || !projection) return item;
  const copy = { ...item };
  if (typeof projection === 'string') {
    const parts = projection.split(/\s+/);
    for (const p of parts) {
      if (p.startsWith('-')) {
        delete copy[p.slice(1)];
      }
    }
  }
  return copy;
}

function makeQuery(promise) {
  const p = Promise.resolve(promise);
  p.sort = (sortObj) => {
    return makeQuery(
      p.then((res) => {
        if (!Array.isArray(res)) return res;
        const sorted = [...res];
        if (sortObj && sortObj.createdAt === -1) {
          sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }
        return sorted;
      })
    );
  };

  p.select = (proj) => {
    return makeQuery(
      p.then((res) => {
        if (Array.isArray(res)) {
          return res.map((item) => stripFields(item, proj));
        }
        return stripFields(res, proj);
      })
    );
  };

  return p;
}

const studentStore = {
  find(query = {}, projection = '') {
    return makeQuery(
      (async () => {
        const students = loadStudents();
        let results = students.map((s) => wrapStudent(s));

        if (query.role) {
          results = results.filter((s) => s.role === query.role);
        }
        if (projection) {
          results = results.map((s) => stripFields(s, projection));
        }
        return results;
      })()
    );
  },

  findOne(query = {}) {
    return makeQuery(
      (async () => {
        const students = loadStudents();
        let match = null;

        if (query.regdNo) {
          const target = String(query.regdNo).trim().toUpperCase();
          match = students.find((s) => String(s.regdNo).trim().toUpperCase() === target);
        } else if (query._id) {
          const target = String(query._id);
          match = students.find((s) => String(s._id) === target);
        }

        if (!match) return null;
        return wrapStudent(match);
      })()
    );
  },

  findById(id) {
    return this.findOne({ _id: id });
  },

  newStudent(data) {
    const s = {
      ...data,
      _id: 'std_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const wrapped = wrapStudent(s);

    // Override save to perform duplicate check on creation
    const originalSave = wrapped.save;
    wrapped.save = async function () {
      const students = loadStudents();
      const cleanRegdNo = String(wrapped.regdNo || '').trim().toUpperCase();
      const existing = students.find((item) => String(item.regdNo || '').trim().toUpperCase() === cleanRegdNo);
      if (existing) {
        const err = new Error('Duplicate registration number');
        err.code = 11000;
        throw err;
      }
      return originalSave();
    };

    return wrapped;
  },

  async create(data) {
    const student = this.newStudent(data);
    await student.save();
    return student;
  },
};

module.exports = studentStore;
