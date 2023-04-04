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

import {
  Dialog,
  DialogHeader,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from 'cx-portal-shared-components'
import { IdentityProvider } from 'features/admin/idpApiSlice'
import { show } from 'features/control/overlay/actions'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { OVERLAYS } from 'types/Constants'

export default function UpdateIDPSuccess({
  idp,
  open,
}: {
  idp: IdentityProvider
  open?: boolean
}) {
  const { t } = useTranslation('idp')
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState<boolean>(open || false)

  const handleNext = () => {
    setIsOpen(false)
    dispatch(show(OVERLAYS.ENABLE_IDP, idp.identityProviderId))
  }

  return (
    <Dialog open={isOpen}>
      <DialogHeader
        title={t('update.success.title')}
        intro={t('update.success.subtitle')}
        closeWithIcon={true}
        onCloseWithIcon={() => setIsOpen(false)}
      />
      <DialogContent>
        <Typography>{t('update.success.desc')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleNext}>
          {t('action.next')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
