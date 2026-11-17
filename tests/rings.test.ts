import { rings, ringsCount } from '../lib/rings';
import FillGenerator from '@civ-clone/core-world/tests/lib/FillGenerator';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import { TopologyId } from '@civ-clone/core-world/Topology';
import World from '@civ-clone/core-world/World';
import { expect } from 'chai';
import { fatCross } from '@civ-clone/base-city-tiles-fat-cross/lib/fatCross';

class Flat extends Terrain {}

describe('rings', (): void => {
  const buildWorld = (
      width: number,
      height: number,
      topologyId: TopologyId
    ): Promise<World> =>
      new World(
        new FillGenerator(height, width, Flat, { topologyId }),
        new RuleRegistry()
      ).build(),
    key = (tile: Tile): string => `${tile.x()},${tile.y()}`,
    // Every tile `count` moves or fewer away, found by walking from neighbour
    // to neighbour.
    walked = (centre: Tile, count: number): string[] => {
      const topology = centre.map().topology(),
        seen = new Set([key(centre)]);
      let frontier: [number, number][] = [[centre.x(), centre.y()]];

      for (let step = 0; step < count; step++) {
        const next: [number, number][] = [];

        frontier.forEach(([x, y]) =>
          topology.directions().forEach((direction) => {
            const neighbour = topology.neighbour(x, y, direction);

            if (neighbour && !seen.has(`${neighbour[0]},${neighbour[1]}`)) {
              seen.add(`${neighbour[0]},${neighbour[1]}`);
              next.push(neighbour);
            }
          })
        );

        frontier = next;
      }

      return [...seen].sort();
    };

  it('is 2 rings', (): void => {
    expect(ringsCount).equal(2);
  });

  it("is the 19-tile hex on the hexagonal grid, the tiles Civ1's fat cross gives there, in the same order, across the seams", async (): Promise<void> => {
    const world = await buildWorld(10, 8, 'hex-odd-r');

    world.forEach((tile: Tile): void => {
      const actual = rings(tile).entries(),
        expected = fatCross(tile).entries();

      expect(actual.length, `at ${key(tile)}`).equal(19);
      expect(actual.map(key), `at ${key(tile)}`).eql(expected.map(key));
      expect(actual.map(key).sort(), `at ${key(tile)}`).eql(walked(tile, 2));
    });
  });

  it('is 7 tiles for 1 ring and 37 for 3 on the hexagonal grid', async (): Promise<void> => {
    const world = await buildWorld(20, 20, 'hex-odd-r');

    [world.get(10, 10), world.get(10, 11)].forEach((centre: Tile): void => {
      expect(rings(centre, 0).entries()).eql([centre]);
      expect(rings(centre, 1).entries().map(key).sort()).eql(walked(centre, 1));
      expect(rings(centre, 1).entries().length).equal(7);
      expect(rings(centre, 3).entries().map(key).sort()).eql(walked(centre, 3));
      expect(rings(centre, 3).entries().length).equal(37);
    });
  });

  it('is the whole 5x5 box on the square grid', async (): Promise<void> => {
    const world = await buildWorld(40, 25, 'square'),
      box: string[] = [];

    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        box.push(`${10 + dx},${10 + dy}`);
      }
    }

    expect(rings(world.get(10, 10)).entries().map(key).sort()).eql(box.sort());
  });

  it('is every tile within reach, once each, on a world smaller than the hex', async (): Promise<void> => {
    const world = await buildWorld(3, 4, 'hex-odd-r');

    world.forEach((tile: Tile): void => {
      const actual = rings(tile).entries().map(key);

      expect(new Set(actual).size).equal(actual.length);
      expect([...actual].sort()).eql(walked(tile, 2));
    });
  });
});
