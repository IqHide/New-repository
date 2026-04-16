import { CreatePresetDto, FilterPreset } from '@/types/filter-preset';
import { baseApi } from './base-api';

const filterPresetsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/filter-presets → кэшируется под тегом FilterPreset
    getFilterPresets: builder.query<FilterPreset[], void>({
      query: () => '/filter-presets',
      providesTags: ['FilterPreset'], // этот кэш помечен тегом
    }),

    // POST /api/filter-presets → после успеха инвалидирует кэш getFilterPresets
    saveFilterPreset: builder.mutation<FilterPreset, CreatePresetDto>({
      query: (body) => ({
        url: '/filter-presets',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FilterPreset'], // убивает кэш → getFilterPresets сам перезапрашивает
    }),

    // DELETE /api/filter-presets/:id
    deleteFilterPreset: builder.mutation<void, string>({
      query: (id) => ({
        url: `/filter-presets/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FilterPreset'],
    }),
  }),
});

export const {
  useGetFilterPresetsQuery,
  useSaveFilterPresetMutation,
  useDeleteFilterPresetMutation,
} = filterPresetsApi;
