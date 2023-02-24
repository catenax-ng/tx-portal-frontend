/********************************************************************************
 * Copyright (c) 2021, 2023 Mercedes-Benz Group AG and BMW Group AG
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

import { Box } from '@mui/material'
import { ImageItem } from '../../ImageGallery/ImageItem'
import { ProviderProps } from '../StaticTypes'
import TextCenterAligned from './TextCenterAligned'

export default function TextImageCenterAligned({
  provider,
}: {
  provider: ProviderProps
}) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        margin: '0px 20px 0px 20px',
        marginTop: '84px',
      }}
    >
      <TextCenterAligned provider={provider} />
      <Box
        sx={{
          marginTop: '84px',
          marginBottom: '84px',
        }}
      >
        <ImageItem
          url={provider.imageUrl || ''}
          text={''}
          size="custom"
          height="472px"
          width="100%"
          hover={true}
          borderRadius={true}
          shadow={false}
          modalWidth="1100"
        />
      </Box>
    </Box>
  )
}
