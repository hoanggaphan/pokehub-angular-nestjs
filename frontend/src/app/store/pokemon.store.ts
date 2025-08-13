import { computed, inject } from '@angular/core';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { PokemonService } from '../services/pokemon.service';
import { Pokemon } from '../models/Pokemon';

type PokemonState = {
    pokemon: Pokemon[];
    isLoading: boolean;
    filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: PokemonState = {
    pokemon: [],
    isLoading: false,
    filter: { query: '', order: 'asc' },
};

export const PokemonStore = signalStore(
    withState(initialState),
    withComputed(({ pokemon, filter }) => ({
        pokemonCount: computed(() => pokemon().length),
        sortedPokemon: computed(() => {
            const direction = filter.order() === 'asc' ? 1 : -1;
				return [...pokemon()].sort(
					(a: Pokemon, b: Pokemon) =>
						direction * a.name.localeCompare(b.name)
				);
        }),
    })),
    withMethods((store, pokemonService = inject(PokemonService)) => ({
        updateFilter(filter: Partial<PokemonState['filter']>): void {
            patchState(store, (state) => ({ filter: { ...state.filter, ...filter } }));
        },
        loadByQuery: rxMethod<string>(
            pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap(() => patchState(store, { isLoading: true })),
                switchMap((query) => {
                    return pokemonService.getByQuery(query).pipe(
                        tapResponse({
                            next: (pokemon) => patchState(store, { pokemon }),
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
    }))
);