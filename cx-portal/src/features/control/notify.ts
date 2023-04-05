/********************************************************************************
 * Copyright (c) 2021, 2023 BMW Group AG
 * Copyright (c) 2021, 2023 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/

import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'features/store'

const name = 'control/notify'

export enum NotifyType {
  NONE = 'NONE',
  SUCCESS_VALID_FORMAT = 'SUCCESS_VALID_FORMAT',
  SUCCESS_UPLOAD_USERS = 'SUCCESS_UPLOAD_USERS',
  SUCCESS_IDP_CREATE = 'SUCCESS_IDP_CREATE',
  SUCCESS_IDP_CONFIG = 'SUCCESS_IDP_CONFIG',
  SUCCESS_IDP_DELETE = 'SUCCESS_IDP_DELETE',
  ERROR_MULTIPLE_FILES = 'ERROR_MULTIPLE_FILES',
  ERROR_INVALID_TYPE = 'ERROR_INVALID_TYPE',
  ERROR_INVALID_FORMAT = 'ERROR_INVALID_FORMAT',
  ERROR_UPLOAD_USERS = 'ERROR_UPLOAD_USERS',
  ERROR_IDP_CREATE = 'ERROR_IDP_CREATE',
  ERROR_IDP_CONFIG = 'ERROR_IDP_CONFIG',
  ERROR_IDP_DELETE = 'ERROR_IDP_DELETE',
}

export type Notify = {
  type: NotifyType
  msg?: string
}

const initialState: Array<Notify> = []

export const slice = createSlice({
  name,
  initialState,
  reducers: {
    enq: (state, action: PayloadAction<Notify>) =>
      (state = [...state, action.payload]),
    deq: (state) => (state = state.slice(1)),
  },
})

export const { enq, deq } = slice.actions

export const notifySelector = (state: RootState): Array<Notify> =>
  state.control.notify

export default slice.reducer
