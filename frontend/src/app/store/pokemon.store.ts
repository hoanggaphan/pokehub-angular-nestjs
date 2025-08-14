import { computed, inject } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, pipe, switchMap, tap } from 'rxjs';
import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import PokemonService, { PageResponse } from '../services/pokemon.service';
import { Pokemon } from '../models/Pokemon';

type PokemonState = {
    pokemon: Pokemon[];
    isLoading: boolean;
    filter: {
        query: string;
        order: 'asc' | 'desc';
        type?: string;
        legendary?: boolean | null;
        speedMin?: number | null;
        speedMax?: number | null;
        page: number;
        limit: number;
    };
    meta: {
        total: number;
        page: number;
        limit: number;
        pageCount: number;
    };
};

const initialState: PokemonState = {
    pokemon: [],
    isLoading: false,
    filter: { query: '', order: 'asc', page: 1, limit: 20, legendary: null, speedMin: null, speedMax: null },
    meta: { total: 0, page: 1, limit: 20, pageCount: 0 },
};

export const PokemonStore = signalStore(
    withState(initialState),
    withComputed(({ pokemon, filter, meta }) => ({
        pokemonCount: computed(() => pokemon().length),
        sortedPokemon: computed(() => {
            const direction = filter.order() === 'asc' ? 1 : -1;
				return [...pokemon()].sort(
					(a: Pokemon, b: Pokemon) =>
						direction * a.name.localeCompare(b.name)
				);
        }),
        page: computed(() => filter.page()),
        limit: computed(() => filter.limit()),
        total: computed(() => meta.total()),
        pageCount: computed(() => meta.pageCount()),
    })),
    withMethods((store, pokemonService = inject(PokemonService)) => ({
        updateFilter(filter: Partial<PokemonState['filter']>): void {
            patchState(store, (state) => ({ filter: { ...state.filter, ...filter } }));
        },
        searchByName: rxMethod<string>(
            pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap(() => patchState(store, { isLoading: true })),
                tap((query) => patchState(store, (state) => ({ filter: { ...state.filter, query, page: 1 } }))),
                switchMap(() => {
                    const f = store.filter();
                    return pokemonService.getPaginated({
                        page: f.page,
                        limit: f.limit,
                        name: f.query || undefined,
                        type: f.type || undefined,
                        generation: undefined,
                        legendary: f.legendary == null ? undefined : f.legendary,
                        speedMin: f.speedMin == null ? undefined : f.speedMin,
                        speedMax: f.speedMax == null ? undefined : f.speedMax,
                    }).pipe(
                        tapResponse({
                            next: (res: PageResponse<Pokemon>) => patchState(store, { pokemon: res.data, meta: res.meta }),
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
        load: rxMethod<void>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                switchMap(() => {
                    const f = store.filter();
                    return pokemonService.getPaginated({
                        page: f.page,
                        limit: f.limit,
                        name: f.query || undefined,
                        type: f.type || undefined,
                        generation: undefined,
                        legendary: f.legendary == null ? undefined : f.legendary,
                        speedMin: f.speedMin == null ? undefined : f.speedMin,
                        speedMax: f.speedMax == null ? undefined : f.speedMax,
                    }).pipe(
                        tapResponse({
                            next: (res: PageResponse<Pokemon>) => patchState(store, { pokemon: res.data, meta: res.meta }),
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
        setPage(page: number) {
            patchState(store, (state) => ({ filter: { ...state.filter, page } }));
        },
        setLimit(limit: number) {
            patchState(store, (state) => ({ filter: { ...state.filter, limit, page: 1 } }));
        },
    }))
);