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

import { useSelector } from 'react-redux'
import { PageSnackbar, PageSnackbarStack } from 'cx-portal-shared-components'
import { SuccessErrorType } from 'features/admin/appuserApiSlice'
import { useTranslation } from 'react-i18next'
import { NotifyType, notifySelector } from 'features/control/notify'

export default function MainNotify() {
  const { t } = useTranslation('notify')
  const notify = useSelector(notifySelector)
  return (
    <div style={{ zIndex: 20 }}>
      <PageSnackbarStack>
        {notify.map((item, i) =>
          ((error: boolean) => (
            <PageSnackbar
              key={i}
              title={t(
                `state.${
                  error ? SuccessErrorType.ERROR : SuccessErrorType.SUCCESS
                }`
              )}
              description={t(item.type)}
              open={item.type !== NotifyType.NONE}
              severity={
                error ? SuccessErrorType.ERROR : SuccessErrorType.SUCCESS
              }
              showIcon
            />
          ))(item.type.toString().startsWith('ERROR_'))
        )}
      </PageSnackbarStack>
    </div>
  )
}
