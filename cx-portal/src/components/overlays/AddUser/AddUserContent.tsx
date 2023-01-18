/********************************************************************************
 * Copyright (c) 2021,2022 BMW Group AG
 * Copyright (c) 2021,2022 Contributors to the Eclipse Foundation
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

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Button,
  DialogActions,
  DialogContent,
  DialogHeader,
} from 'cx-portal-shared-components'
import { UserRoles } from './UserRoles'
import {
  rolesToAddSelector,
  usersToAddSelector,
} from 'features/admin/userDeprecated/slice'
import { useDispatch, useSelector } from 'react-redux'
import { closeOverlay, show } from 'features/control/overlay/actions'
import { OVERLAYS } from 'types/Constants'
import './AddUserOverlay.scss'
import { SingleUserContent } from './SingleUserContent'
import {
  setAddUserError,
  setAddUserSuccess,
  useAddTenantUsersMutation,
} from 'features/admin/userApiSlice'
import { setRolesToAdd } from 'features/admin/userDeprecated/actions'
import { IdentityProvider, IDPCategory } from 'features/admin/idpApiSlice'
import { IHashMap } from 'types/MainTypes'

export const AddUserContent = ({ idp }: { idp: IdentityProvider }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const usersToAdd = useSelector(usersToAddSelector)
  const rolesToAdd = useSelector(rolesToAddSelector)
  const [addTenantUsers, { isSuccess, isError }] = useAddTenantUsersMutation()
  const fields: IHashMap<string> = {}
  const [data, setData] = useState(fields)

  if (isSuccess) {
    dispatch(setAddUserSuccess(isSuccess))
    dispatch(closeOverlay())
  }

  if (isError) {
    dispatch(setAddUserError(isError))
    dispatch(closeOverlay())
  }

  useEffect(() => {
    dispatch(setRolesToAdd([]))
  }, [dispatch])

  const handleConfirm = async () => {
    dispatch(setAddUserSuccess(false))
    dispatch(setAddUserError(false))
    const addUser = { ...usersToAdd, roles: rolesToAdd }
    try {
      await addTenantUsers([addUser]).unwrap()
    } catch (err) {}
  }

  const setField = (key: string, value: string) => {
    console.log('data', data)
    const updateData = {...data}
    updateData[key] = value
    setData(updateData)
    console.log('update', updateData)
  }

  return (
    <>
      <DialogHeader
        {...{
          title: t('content.addUser.headline'),
          intro: t('content.addUser.subheadline'),
          closeWithIcon: true,
          onCloseWithIcon: () => dispatch(show(OVERLAYS.NONE)),
        }}
      />

      <DialogContent className="w-100">
        <SingleUserContent
          withUserId={
            idp.identityProviderCategoryId !== IDPCategory.KEYCLOAK_SHARED
          }
          setValue={setField}
        />
        <UserRoles />
      </DialogContent>

      <DialogActions helperText={t('content.addUser.helperText')}>
        <Button
          variant="outlined"
          onClick={() => dispatch(show(OVERLAYS.NONE))}
        >
          {t('global.actions.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
        >
          {t('global.actions.confirm')}
        </Button>
      </DialogActions>
    </>
  )
}