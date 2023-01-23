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

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme, CircularProgress } from '@mui/material'
import debounce from 'lodash.debounce'
import {
  SearchInput,
  ViewSelector,
  SortOption,
  PageHeader,
} from 'cx-portal-shared-components'
import SortIcon from '@mui/icons-material/Sort'
import './AdminBoard.scss'
import { PageBreadcrumb } from 'components/shared/frame/PageBreadcrumb/PageBreadcrumb'
import {
  AppContent,
  useFetchAppReleaseAppsQuery,
} from 'features/adminBoard/adminBoardApiSlice'
import AdminBoardElements from './AdminBoardElements'

export default function AppSubscription() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [searchExpr, setSearchExpr] = useState<string>('')
  const [showModal, setShowModalValue] = useState<boolean>(false)
  const [selected, setSelected] = useState<string>('InReview')
  const [sortOption, setSortOption] = useState<string>('new')
  const [appCards, setAppCards] = useState<AppContent[]>([])

  let statusId = selected

  let sortingType = 'DateDesc'
  if (sortOption === 'title') {
    sortingType = 'NameAsc'
  }

  const { data } = useFetchAppReleaseAppsQuery({
    page: 0,
    statusId: statusId,
    sortingType: sortingType,
  })

  const apps = data && data.content

  useEffect(() => apps && setAppCards(apps), [apps])

  const setView = (e: React.MouseEvent<HTMLInputElement>) =>
    setSelected(e.currentTarget.value)

  const sortOptions = [
    {
      label: t('content.adminBoard.sortOptions.newFirst'),
      value: 'new',
    },
    {
      label: t('content.adminBoard.sortOptions.AppTitle'),
      value: 'title',
    },
  ]

  const filterButtons: any[] = [
    {
      buttonText: t('content.adminBoard.tabs.open'),
      buttonValue: 'InReview',
      onButtonClick: (e: React.MouseEvent<HTMLInputElement>) => {},
    },
    {
      buttonText: t('content.adminBoard.tabs.all'),
      buttonValue: 'All',
      onButtonClick: (e: React.MouseEvent<HTMLInputElement>) => {},
    },
  ].map((btn) => (btn.onButtonClick = setView))

  console.log('testing')

  const debouncedFilter = useMemo(
    () =>
      debounce((expr: string) => {
        apps &&
          setAppCards(
            expr
              ? apps &&
                  apps.filter(
                    (app: AppContent) =>
                      app.provider
                        ?.toLowerCase()
                        .includes(expr.toLowerCase()) ||
                      app.name?.toLowerCase().includes(expr.toLowerCase())
                  )
              : apps
          )
      }, 300),
    [apps]
  )

  const handleSearch = useCallback(
    (expr: string) => {
      setSearchExpr(expr)
      debouncedFilter(expr)
    },
    [debouncedFilter]
  )

  const handleSortOption = (value: string) => {
    setSortOption(value)
    setShowModalValue(false)
  }

  return (
    <div className="adminBoard">
      <PageHeader
        title={t('content.adminBoard.headerTitle')}
        topPage={true}
        headerHeight={200}
      >
        <PageBreadcrumb backButtonVariant="contained" />
      </PageHeader>
      <div className="mainContainer">
        <div className="searchContainer">
          <SearchInput
            placeholder={t('content.adminBoard.search')}
            value={searchExpr}
            autoFocus={false}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div
          className="filterSection"
          onMouseLeave={() => setShowModalValue(false)}
        >
          <ViewSelector activeView={selected} views={filterButtons} />
          <div className="iconSection">
            <SortIcon
              onClick={() => setShowModalValue(true)}
              sx={{
                fontSize: 20,
                color: '#939393',
                ':hover': { color: '#0D55AF' },
              }}
            />
          </div>
          <div className="sortSection">
            <SortOption
              show={showModal}
              selectedOption={sortOption}
              setSortOption={handleSortOption}
              sortOptions={sortOptions}
            />
          </div>
        </div>
        {!apps ? (
          <div className="loading-progress">
            <CircularProgress
              size={50}
              sx={{
                color: theme.palette.primary.main,
              }}
            />
          </div>
        ) : (
          <AdminBoardElements apps={appCards} />
        )}
      </div>
    </div>
  )
}