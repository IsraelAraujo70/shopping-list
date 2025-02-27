import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ListItem {
  id: string;
  name: string;
  estimatedPrice?: number | null;
  quantity: number;
  completed: boolean;
}

interface List {
  id: string;
  name: string;
  items: ListItem[];
}

interface ListsState {
  items: List[];
  loading: boolean;
  error: string | null;
}

const initialState: ListsState = {
  items: [],
  loading: false,
  error: null,
};

export const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    setLists: (state, action: PayloadAction<List[]>) => {
      state.items = action.payload;
      state.error = null;
    },
    addList: (state, action: PayloadAction<List>) => {
      state.items.push(action.payload);
    },
    removeList: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(list => list.id !== action.payload);
    },
    updateList: (state, action: PayloadAction<List>) => {
      const index = state.items.findIndex(list => list.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setLists, 
  addList, 
  removeList, 
  updateList, 
  setLoading, 
  setError 
} = listsSlice.actions;

export default listsSlice.reducer;