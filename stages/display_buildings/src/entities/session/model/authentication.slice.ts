import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createAuthService } from "@shared/api";
import { createBackendService } from "@shared/api";
import type {
  AuthResponse,
  LoginCredentials,
  UserJWTData,
} from "./types";

interface ErrorWithDescription {
  message: string;
  description: string;
}

interface AuthenticationState {
  user: UserJWTData | null;
  accessToken: string | null;
  loginInProgress: boolean;
  starting: boolean;
  error: ErrorWithDescription | null;
}

const initialState: AuthenticationState = {
  user: null,
  accessToken: null,
  loginInProgress: false,
  starting: true,
  error: null,
};

const backendService = createBackendService();
const authService = createAuthService();

export const loginThunk = createAsyncThunk(
  "authentication/login",
  async ({ login, password }: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = (await backendService.post("users/login", {
        login,
        password,
      })) as AuthResponse;

      if (response.success) {
        return response;
      }
    } catch (err: any) {
      return rejectWithValue({
        title: err?.message,
        description: err?.description,
      });
    }
  },
);

export const logoutThunk = createAsyncThunk(
  "authentication/logout",
  async () => {
    const response = (await backendService.post(
      "users/logout",
      {},
    )) as AuthResponse;
    if (response.success) {
      return response;
    }
  },
);

export const authFromLocalStorage = createAction(
  "authentication/authFromLocalStorage",
  () => {
    const authService = createAuthService();
    const user = authService.getUser();
    return {
      payload: user || null,
    };
  },
);

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
    cleanError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    getUser: (state) => state.user,
    getUsername: (state) => state.user?.login,
    getUserRole: (state) => state.user?.role,
    getIsAuthenticated: (state) => Boolean(state.user),
    getError: (state) => state.error?.message ?? null,
    getErrorDescription: (state) => state.error?.description ?? null,
    getStarting: (state) => state.starting,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loginInProgress = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loginInProgress = false;
        const payload = action.payload as
          | { title?: string; description?: string }
          | undefined;
        state.error = {
          message: payload?.title ?? "",
          description: payload?.description ?? "",
        };
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loginInProgress = false;

        if (action.payload?.accessToken) {
          const { accessToken } = action.payload;

          authService.store(accessToken);
          state.user = authService.getUser();
        }
      })
      .addCase(logoutThunk.fulfilled, (state, action) => {
        const success = action.payload;
        if (success) {
          authService.drop();
          state.user = null;
          state.accessToken = null;
        }
      })
      .addCase(authFromLocalStorage, (state, action) => {
        const user = action.payload;
        state.user = user;
        state.starting = false;
      });
  },
});
