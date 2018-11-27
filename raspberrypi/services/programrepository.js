/*
 * Should persist in database, in memory for now
 */

class ProgramRepository {
  constructor() {
    this.programs = new Map();
  }

  exists(uuid) {
    return this.programs.hasOwnProperty(uuid);
  }

  get(uuid) {
    return this.programs[uuid];
  }

  add(p) {
    this.programs[p.uuid] = p;
  }

  remove(uuid) {
    delete this.programs[uuid];
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
