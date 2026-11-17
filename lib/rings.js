"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rings = exports.ringsCount = void 0;
const Tileset_1 = require("@civ-clone/core-world/Tileset");
/**
 * How many rings of neighbours round its centre a city may work. On the
 * hexagonal grid 2 rings is the 19-tile hex: the centre, its 6 neighbours and
 * the 12 tiles beyond them.
 */
exports.ringsCount = 2;
/**
 * Every tile `count` or fewer steps from `centre`, by the topology's `steps`
 * (the fewest moves from neighbour to neighbour, which means the same on every
 * grid), in the order of the topology's `area` of `count` around it. A city's
 * `Tiles` rule returns this for its own tile.
 *
 * On the hexagonal grid that is the whole hex of `count` rings, 1 + 3·count·
 * (count + 1) tiles: 7 for 1 ring, 19 for 2, 37 for 3. On the square grid,
 * where a diagonal is one step, it is the whole (2·count + 1)² box.
 */
const rings = (centre, count = exports.ringsCount) => {
    const world = centre.map(), topology = world.topology(), x = centre.x(), y = centre.y();
    // `filter` keeps `area`'s order, so tiles that score the same are offered to
    // the city in the order the topology documents.
    return Tileset_1.default.from(...topology
        .area(x, y, count)
        .filter(([areaX, areaY]) => topology.steps(x, y, areaX, areaY) <= count)
        .map(([areaX, areaY]) => world.get(areaX, areaY)));
};
exports.rings = rings;
exports.default = exports.rings;
//# sourceMappingURL=rings.js.map