# base-city-tiles-rings

The tiles a city may work, as a library for a ruleset's `Tiles` rule:

- `lib/rings`: `rings(centre, count = ringsCount)`, every tile `count` or fewer steps from `centre` by the world
  topology's own `steps`, in the order of the topology's `area`. `ringsCount` is 2: on the hexagonal grid that is the
  19-tile hex, the centre, its 6 neighbours and the 12 tiles beyond them. On the square grid it is the whole 5x5 box.

A library: it registers no rules. See `civ1-city` for Civilization's `Tiles` rule, which uses this on the hexagonal
grid and `base-city-tiles-fat-cross` elsewhere.
