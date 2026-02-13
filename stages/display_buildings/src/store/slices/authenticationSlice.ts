import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createAuthService } from "@services/authService";
import { createBackendService } from "@services/backendService";
import { AuthResponse, LoginCredentials, User } from "src/types/auth-types";

interface AuthenticationState {
  user: User | null;
  accessToken: string | null;
  loginInProgress: boolean;
  error: string | null;
}

const initialState: AuthenticationState = {
  user: null,
  accessToken: null,
  loginInProgress: false,
  error: null,
};

const backendService = createBackendService();
const authService = createAuthService();

export const loginThunk = createAsyncThunk(
  "authentication/login",
  async ({ login, password }: LoginCredentials) => {
    const response = (await backendService.post("users/login", {
      login,
      password,
    })) as AuthResponse;

    if (response.success) {
      return response;
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
  reducers: {},
  selectors: {
    getUser: (state) => state.user,
    getUsername: (state) => state.user?.login,
    getUserRole: (state) => state.user?.role,
    getIsAuthenticated: (state) => Boolean(state.user),
    getError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loginInProgress = true;
      })
      .addCase(loginThunk.rejected, (state /*, action */) => {
        state.loginInProgress = false;
        state.error = "Не удалось прилогиниться";
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        const { accessToken = "" } = action.payload || {};
        state.loginInProgress = false;

        if (accessToken) {
          authService.store(accessToken);
          state.user = authService.getUser();
        }
      })
      .addCase(logoutThunk.fulfilled, (state, action) => {
        const success = action.payload;
        if (success) {
          state.user = null;
          state.accessToken = null;
          authService.drop();
        }
      })
      .addCase(authFromLocalStorage, (state, action) => {
        const user = action.payload;
        state.user = user;
      });
  },
});
