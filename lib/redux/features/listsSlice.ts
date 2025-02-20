import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface List {
  id: string;
  name: string;
  items: Item[];
}

interface Item {
  id: string;
  name: string;
  quantity: number;
  price?: number;
  checked: boolean;
}

interface ListsState {
  lists: List[];
  activeList: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ListsState = {
  lists: [],
  activeList: null,
  loading: false,
  error: null,
};

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    setLists: (state, action: PayloadAction<List[]>) => {
      state.lists = action.payload;
    },
    setActiveList: (state, action: PayloadAction<string>) => {
      state.activeList = action.payload;
    },
    addList: (state, action: PayloadAction<List>) => {
      state.lists.push(action.payload);
    },
    updateList: (state, action: PayloadAction<List>) => {
      const index = state.lists.findIndex(list => list.id === action.payload.id);
      if (index !== -1) {
        state.lists[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLists,
  setActiveList,
  addList,
  updateList,
  setLoading,
  setError,
} = listsSlice.actions;

export default listsSlice.reducer;