import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createAuthService } from "@services/authService";
import { createBackendService } from "@services/backendService";
import {
  AuthResponse,
  LoginCredentials,
  UserJWTData,
} from "src/types/auth-types";

interface ErrorWithDescription {
  title: string;
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
    } catch (err) {
      return rejectWithValue(err);
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
    cleanError: (state) => {
      state.error = null;
      state.errorDescription = null;
    },
  },
  selectors: {
    getUser: (state) => state.user,
    getUsername: (state) => state.user?.login,
    getUserRole: (state) => state.user?.role,
    getIsAuthenticated: (state) => Boolean(state.user),
    getError: (state) => state.error,
    getErrorDescription: (state) => state.errorDescription,
    getStarting: (state) => state.starting,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loginInProgress = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loginInProgress = false;
        state.error = {
          title: action.payload.message,
          description: action.payload.description,
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
          state.user = state.accessToken = null;
        }
      })
      .addCase(authFromLocalStorage, (state, action) => {
        const user = action.payload;
        state.user = user;
        state.starting = false;
      });
  },
});
