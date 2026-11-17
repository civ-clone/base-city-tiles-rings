import Tile from '@civ-clone/core-world/Tile';
import Tileset from '@civ-clone/core-world/Tileset';
/**
 * How many rings of neighbours round its centre a city may work. On the
 * hexagonal grid 2 rings is the 19-tile hex: the centre, its 6 neighbours and
 * the 12 tiles beyond them.
 */
export declare const ringsCount = 2;
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
export declare const rings: (centre: Tile, count?: number) => Tileset;
export default rings;
