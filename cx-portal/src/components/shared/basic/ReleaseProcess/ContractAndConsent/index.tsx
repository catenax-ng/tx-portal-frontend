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
  Button,
  IconButton,
  PageNotifications,
  PageSnackbar,
  Typography,
  UploadFileStatus,
  UploadStatus,
} from 'cx-portal-shared-components'
import { useTranslation } from 'react-i18next'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { Divider, Box, Grid, InputLabel } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { ConnectorFormInputField } from '../AppMarketCard'
import { useDispatch, useSelector } from 'react-redux'
import {
  appIdSelector,
  decrement,
  increment,
} from 'features/appManagement/slice'
import {
  AgreementStatusType,
  ConsentType,
  UpdateAgreementConsentType,
  useFetchAgreementDataQuery,
  useFetchConsentDataQuery,
  useUpdateAgreementConsentsMutation,
  useFetchAppStatusQuery,
  useUpdateDocumentUploadMutation,
} from 'features/appManagement/apiSlice'
import { setAppStatus } from 'features/appManagement/actions'

type AgreementType = {
  agreementId: string
  name: string
  consentStatus?: boolean | string
}[]

export default function ContractAndConsent() {
  const { t } = useTranslation()
  const [contractNotification, setContractNotification] = useState(false)
  const [contractSnackbar, setContractSnackbar] = useState<boolean>(false)
  const dispatch = useDispatch()
  const appId = useSelector(appIdSelector)
  const fetchAgreementData = useFetchAgreementDataQuery().data
  const fetchConsentData = useFetchConsentDataQuery(appId ?? '').data
  const [updateAgreementConsents] = useUpdateAgreementConsentsMutation()
  const [updateDocumentUpload] = useUpdateDocumentUploadMutation()
  const [agreementData, setAgreementData] = useState<AgreementType>([])
  const [defaultValue, setDefaultValue] = useState<ConsentType>({
    agreements: [],
  })

  const fetchAppStatus = useFetchAppStatusQuery(appId ?? '', {
    refetchOnMountOrArgChange: true,
  }).data

  const defaultValues = {
    agreements: defaultValue,
    uploadImageConformity:
      fetchAppStatus?.documents?.CONFORMITY_APPROVAL_BUSINESS_APPS || null,
  }

  useEffect(() => {
    dispatch(setAppStatus(fetchAppStatus))
  }, [dispatch, fetchAppStatus])

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchConsentData, fetchAgreementData])

  const loadData = () => {
    const fetchConsent = fetchConsentData?.agreements.map(
      (item: AgreementStatusType) => ({
        ...item,
        consentStatus: item.consentStatus === 'ACTIVE',
      })
    )

    const consentAgreementData: any =
      fetchAgreementData &&
      fetchConsent &&
      fetchAgreementData?.map((item, index: number) =>
        Object.assign({}, item, fetchConsent[index])
      )

    fetchAgreementData && setAgreementData(consentAgreementData)

    const defaultCheckboxData = consentAgreementData?.reduce(
      (data: any, item: AgreementStatusType) => {
        return { ...data, [item.agreementId]: item.consentStatus }
      },
      {}
    )

    setDefaultValue({ ...defaultCheckboxData, agreements: agreementData })
    reset({ ...defaultCheckboxData, agreements: agreementData })
  }

  const {
    handleSubmit,
    getValues,
    control,
    trigger,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onChange',
  })

  const uploadImageConformityValue = getValues().uploadImageConformity
  const defaultuploadImageConformity = defaultValues.uploadImageConformity

  useEffect(() => {
    if (
      defaultuploadImageConformity &&
      Object.keys(defaultuploadImageConformity).length > 0
    ) {
      setValue('uploadImageConformity', {
        id:
          defaultuploadImageConformity &&
          defaultuploadImageConformity[0]?.documentId,
        name:
          defaultuploadImageConformity &&
          defaultuploadImageConformity[0]?.documentName,
        status: UploadStatus.UPLOAD_SUCCESS,
      })
      setFileStatus('uploadImageConformity', UploadStatus.UPLOAD_SUCCESS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultuploadImageConformity])

  const setFileStatus = (
    fieldName: Parameters<typeof setValue>[0],
    status: UploadFileStatus
  ) => {
    const value = getValues(fieldName)

    setValue(fieldName, {
      id: value.id,
      name: value.name,
      size: value.size,
      status,
    } as any)
  }

  useEffect(() => {
    const value = getValues().uploadImageConformity

    if (Array.isArray(value)) {
      setValue('uploadImageConformity', {
        id:
          defaultuploadImageConformity &&
          defaultuploadImageConformity[0]?.documentId,
        name:
          defaultuploadImageConformity &&
          defaultuploadImageConformity[0]?.documentName,
        status: UploadStatus.UPLOAD_SUCCESS,
      })
      setFileStatus('uploadImageConformity', UploadStatus.UPLOAD_SUCCESS)
    }

    if (value && !Array.isArray(value) && !('status' in value)) {
      setFileStatus('uploadImageConformity', UploadStatus.UPLOADING)

      uploadDocumentApi(appId, 'CONFORMITY_APPROVAL_BUSINESS_APPS', value)
        .then(() =>
          setFileStatus('uploadImageConformity', UploadStatus.UPLOAD_SUCCESS)
        )
        .catch(() =>
          setFileStatus('uploadImageConformity', UploadStatus.UPLOAD_ERROR)
        )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadImageConformityValue])

  const onContractConsentSubmit = async (data: any, buttonLabel: string) => {
    const validateFields = await trigger([
      'agreements',
      'uploadImageConformity',
    ])
    if (validateFields) {
      handleSave(data, buttonLabel)
    }
  }

  const handleSave = async (data: any, buttonLabel: string) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([i, item]) => typeof item === 'boolean')
    )

    const updateAgreementData = Object.entries(filteredData).map((entry) =>
      Object.assign(
        {},
        {
          agreementId: entry[0],
          consentStatus: entry[1] === true ? 'ACTIVE' : 'INACTIVE',
        }
      )
    )

    const updateData: UpdateAgreementConsentType = {
      appId: appId,
      body: {
        agreements: updateAgreementData,
      },
    }

    await updateAgreementConsents(updateData)
      .unwrap()
      .then(() => {
        buttonLabel === 'saveAndProceed' && dispatch(increment())
        buttonLabel === 'save' && setContractSnackbar(true)
      })
      .catch(() => {
        setContractNotification(true)
      })
  }

  const uploadDocumentApi = async (
    appId: string,
    documentTypeId: string,
    file: any
  ) => {
    const data = {
      appId: appId,
      documentTypeId: documentTypeId,
      body: { file },
    }

    await updateDocumentUpload(data).unwrap()
  }

  const onBackIconClick = () => {
    dispatch(setAppStatus(fetchAppStatus))
    dispatch(decrement())
  }

  return (
    <div className="contract-consent">
      <Typography variant="h3" mt={10} mb={4} align="center">
        {t('content.apprelease.contractAndConsent.headerTitle')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item md={11} sx={{ mr: 'auto', ml: 'auto', mb: 9 }}>
          <Typography variant="body2" align="center">
            {t('content.apprelease.contractAndConsent.headerDescription')}
          </Typography>
        </Grid>
      </Grid>
      <form className="header-description">
        {agreementData?.map((item) => (
          <div className="form-field" key={item.agreementId}>
            <ConnectorFormInputField
              {...{
                control,
                trigger,
                errors,
                name: item.agreementId,
                defaultValues: item.consentStatus,
                label: item.name,
                type: 'checkbox',
                rules: {
                  required: {
                    value: true,
                    message: `${item.name} ${t(
                      'content.apprelease.appReleaseForm.isMandatory'
                    )}`,
                  },
                },
              }}
            />
          </div>
        ))}
        <div className="form-field">
          <InputLabel sx={{ mb: 3, mt: 3 }}>
            {t('content.apprelease.appMarketCard.appLeadImageUpload') + ' *'}
          </InputLabel>
          <ConnectorFormInputField
            {...{
              control,
              trigger,
              errors,
              name: 'uploadImageConformity',
              type: 'dropzone',
              acceptFormat: {
                'application/pdf': ['.pdf'],
              },
              maxFilesToUpload: 1,
              maxFileSize: 819200,
              rules: {
                required: {
                  value: true,
                },
              },
            }}
          />
          {errors?.uploadImageConformity?.type === 'required' && (
            <Typography variant="body2" className="file-error-msg">
              {t('content.apprelease.appReleaseForm.fileUploadIsMandatory')}
            </Typography>
          )}

          <Typography variant="body2" mt={3} sx={{ fontWeight: 'bold' }}>
            {t('content.apprelease.appReleaseForm.note')}
          </Typography>
          <Typography variant="body2" mb={3}>
            {t('content.apprelease.appReleaseForm.OnlyOneFileAllowed')}
          </Typography>
        </div>
      </form>
      <Box mb={2}>
        {contractNotification && (
          <Grid container xs={12} sx={{ mb: 2 }}>
            <Grid xs={6}></Grid>
            <Grid xs={6}>
              <PageNotifications
                title={t('content.apprelease.appReleaseForm.error.title')}
                description={t(
                  'content.apprelease.appReleaseForm.error.message'
                )}
                open
                severity="error"
                onCloseNotification={() => setContractNotification(false)}
              />
            </Grid>
          </Grid>
        )}
        <PageSnackbar
          open={contractSnackbar}
          onCloseNotification={() => setContractSnackbar(false)}
          severity="success"
          description={t(
            'content.apprelease.appReleaseForm.dataSavedSuccessMessage'
          )}
          autoClose={true}
        />
        <Divider sx={{ mb: 2, mr: -2, ml: -2 }} />
        <Button
          variant="outlined"
          sx={{ mr: 1 }}
          startIcon={<HelpOutlineIcon />}
        >
          {t('content.apprelease.footerButtons.help')}
        </Button>
        <IconButton color="secondary" onClick={() => onBackIconClick()}>
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Button
          variant="contained"
          disabled={!isValid}
          sx={{ float: 'right' }}
          onClick={handleSubmit((data) =>
            onContractConsentSubmit(data, 'saveAndProceed')
          )}
        >
          {t('content.apprelease.footerButtons.saveAndProceed')}
        </Button>
        <Button
          variant="outlined"
          name="send"
          sx={{ float: 'right', mr: 1 }}
          onClick={handleSubmit((data) =>
            onContractConsentSubmit(data, 'save')
          )}
        >
          {t('content.apprelease.footerButtons.save')}
        </Button>
      </Box>
    </div>
  )
}
