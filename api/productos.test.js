import assert from 'node:assert/strict';
import test from 'node:test';
import { parseProductFilters } from './productos.js';

test('parsea los filtros opcionales de productos', () => {
    assert.deepEqual(
        parseProductFilters({
            categoria: 'Procesadores',
            precioMax: '250',
            compatibilidad: 'AM5',
        }),
        {
            filter: {
                categoria: 'Procesadores',
                precio: { $lte: 250 },
                compatibleCon: { $in: ['AM5'] },
            },
        },
    );
});

test('permite consultas sin filtros', () => {
    assert.deepEqual(parseProductFilters({}), { filter: {} });
});

test('rechaza un precio máximo negativo o no numérico', () => {
    assert.ok(parseProductFilters({ precioMax: '-1' }).error);
    assert.ok(parseProductFilters({ precioMax: 'no-es-un-numero' }).error);
});
