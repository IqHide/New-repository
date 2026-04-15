import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterPreset } from '@/types/filter-preset';

interface FiltersState {
  activeBrands: string[];
  onlyWithPhoto: boolean;
  accelerationRange: [number, number];
  quarterMileRange: [number, number];
  nurburgringRange: [number, number];
}

const initialState: FiltersState = {
  activeBrands: [],
  onlyWithPhoto: false,
  accelerationRange: [2, 10],
  quarterMileRange: [0, 30],
  nurburgringRange: [0, 30],
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    toggleBrand(state, action: PayloadAction<string>) {
      const brand = action.payload;
      if (state.activeBrands.includes(brand)) {
        state.activeBrands = state.activeBrands.filter((b) => b !== brand);
      } else {
        state.activeBrands.push(brand);
      }
    },
    clearBrands(state) {
      state.activeBrands = [];
    },
    setOnlyWithPhoto(state, action: PayloadAction<boolean>) {
      state.onlyWithPhoto = action.payload;
    },
    setAccelerationRange(state, action: PayloadAction<[number, number]>) {
      state.accelerationRange = action.payload;
    },
    setQuarterMileRange(state, action: PayloadAction<[number, number]>) {
      state.quarterMileRange = action.payload;
    },
    setNurburgringRange(state, action: PayloadAction<[number, number]>) {
      state.nurburgringRange = action.payload;
    },
    applyPreset(state, action: PayloadAction<FilterPreset>) {
      const p = action.payload;
      state.activeBrands = p.brand ? p.brand.split(',') : [];
      state.onlyWithPhoto = p.onlyWithPhoto;
      state.accelerationRange = [p.accelerationMin, p.accelerationMax];
      state.quarterMileRange = [p.quarterMileMin, p.quarterMileMax];
      state.nurburgringRange = [p.nurburgringMin, p.nurburgringMax];
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  toggleBrand,
  clearBrands,
  setOnlyWithPhoto,
  setAccelerationRange,
  setQuarterMileRange,
  setNurburgringRange,
  applyPreset,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
