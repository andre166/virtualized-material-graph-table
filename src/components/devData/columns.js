import React from 'react'
import WbSunnyIcon from '@material-ui/icons/WbSunny'
import Brightness2Icon from '@material-ui/icons/Brightness2'

export const columns = [
  {
    dataKey: 'first_name',
    label: 'First Name',
  },
  {
    dataKey: 'last_name',
    label: 'Last Name',
  },
  {
    dataKey: 'email',
    label: 'E-mail',
  },
  {
    dataKey: 'gender',
    label: 'Gender',
  },
  {
    dataKey: 'future',
    label: 'Birthday',
    type: 'date',
  },
  {
    dataKey: 'number',
    label: 'Numeros',
    type: 'numeric',
  },
]
