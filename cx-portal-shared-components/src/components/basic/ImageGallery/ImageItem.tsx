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

import { useState } from 'react'
import { Image } from '../Image'
import { Typography } from '../Typography'
import ImageItemOverlay from './ImageItemOverlay'
import { ImageType } from './types'

export const ImageItem = ({
  url,
  text,
  size = 'large-square',
  hover = true,
  borderRadius = true,
  shadow = true,
  modalWidth,
}: ImageType) => {
  const [hovered, setHovered] = useState(false)
  return (
    <>
      {hovered ? (
        <ImageItemOverlay
          onClose={() => setHovered(false)}
          url={url}
          text={text}
          size={size}
          hover={hover}
          borderRadius={borderRadius}
          shadow={shadow}
          modalWidth={modalWidth}
        />
      ) : (
        <div
          onClick={() => hover && setHovered(true)}
          style={{
            height: '100%',
          }}
        >
          <Image src={url} alt={text} />
          <Typography
            variant="body2"
            sx={{
              color: '#888888',
              margin: '5px 0',
              fontSize: '14px',
            }}
          >
            {text}
          </Typography>
        </div>
      )}
    </>
  )
}
