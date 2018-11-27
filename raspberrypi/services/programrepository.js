/*
 * Should persist in database, in memory for now
 */

class ProgramRepository {
  constructor() {
    this.programs = new Map();
  }

  add(p) {
    this.programs[p.uuid] = p;
  }

  get(uuid) {
    return this.programs[uuid];
  }

  exists(uuid) {
    return this.programs.hasOwnProperty(uuid);
  }

  all() {
    let a = [];

    for (const uuid in this.programs) {
      if (this.exists(uuid)) {
        a.push(this.programs[uuid]);
      }
    }
    return a;
  }
}

/*
 * Singleton
 */
const instance = new ProgramRepository();
module.exports = instance;
