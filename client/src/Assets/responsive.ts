import { css } from 'styled-components'

export const mobile = (props: any) => {
  return css`
    @media only screen and (max-width: 430px) {
      ${props}
    }
  `
}

export const tablet = (props: any) => {
  return css`
    @media only screen and (max-width: 768px) {
      ${props}
    }
  `
}
