import * as React from 'react'
import {Component} from 'react'
import styled from 'react-emotion'
import {css} from 'emotion'
import {
  alignItems,
  alignSelf,
  background,
  borderRadius,
  borders,
  bottom,
  boxShadow,
  color,
  flex,
  flexDirection,
  flexWrap,
  fontSize,
  fontWeight,
  height,
  justifyContent,
  left,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  position,
  propTypes,
  right,
  space,
  style,
  styles,
  textAlign,
  top,
  util,
  width,
  zIndex,
} from 'styled-system'
import tag from 'clean-tag'

const vspace = props => {
  let v = props.vspace
  const theme = util.fallbackTheme(props)
  if (v == null) return undefined
  if (theme && theme.space && theme.space[v]) {
    v = util.px(theme.space[v])
  }
  return css`
    &>* {
      margin-top: ${v};
    }
    &>*:first-child {
      margin-top: 0;
    }
  `
}

const hspace = props => {
  let v = props.hspace
  const theme = util.fallbackTheme(props)
  if (v == null) return undefined
  if (theme && theme.space && theme.space[v]) {
    v = util.px(theme.space[v])
  }
  return css`
    &>* {
      margin-left: ${v};
    }
    &>*:first-child {
      margin-left: 0;
    }
  `
}

// TODO: Is there an easy way to say 'apply all of the styles to this styled-component'?
export const Box = styled(tag)`
${vspace} ${hspace}
${space}
${width} ${height}
${minWidth} ${maxWidth} ${minHeight} ${maxHeight}
${fontSize}
${fontWeight}
${color}
${flex}
${textAlign}
${background}
${borders} ${borderRadius}
${boxShadow}
${position} ${zIndex} ${left} ${top} ${right} ${bottom}
` as any

export const Flex = styled(Box)`
display: flex;
${alignItems}
${justifyContent}
${flexWrap}
${flexDirection}
${alignSelf}
` as any

export const VFlex = styled(Flex)`
` as any
VFlex.defaultProps = {
  flexDirection: 'column'
}

export const Fill = styled(Box)`
flex: 1 1 auto;
` as any

export const BoxClickable = styled(Box)`
cursor: pointer;
user-select: none;
` as any

export const FlexClickable = styled(Flex)`
cursor: pointer;
user-select: none;
` as any

export const Span = styled(Box.withComponent(tag.span))`
display: inline-block;
` as any

export class Stack extends Component {
  render() {
    const [first, ...rest] = React.Children.toArray(this.props.children)
    if (first == null) return null
    return (
      <Box
        className={css`
        position: relative;
        &>*:not(:first-child) {
          position: absolute;
          top: 0;
          left: 0;
        }
      `}>
        {first}
        {rest && <Stack>{rest}</Stack>}
      </Box>
    )
  }
}

export const TextInput = styled(Box.withComponent(tag.input))`
box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.1);
border-radius: 5px;
border: 1px solid #ddd;
&:disabled {
  background: #eee;
}
` as any
TextInput.defaultProps = {
  type: 'text',
  p: 1,
}

export const Label = styled(Span)`` as any
Label.defaultProps = {
  p: 1,
  textAlign: 'center',
  minWidth: '1rem',
}

// TODO: How to merge with an existing classname?

export const Button = styled(BoxClickable.withComponent(tag.button))`
// TODO: Why is this necessary?
${space} 
${width} ${height}
${minWidth} ${maxWidth} ${minHeight} ${maxHeight}
${fontSize}
${fontWeight}
${color} 
${flex}
${textAlign}
${background};

// https://gist.github.com/fredsted/7147450
text-decoration: none;
color: black;
font-size: 11px;
border:1px solid #9C9C9C;
display: inline-block;
background-image: -webkit-linear-gradient(
#ffffff 0%, #F6F6F6 	30%, 
#F3F3F3 45%, #EDEDED 	60%, 
#eeeeee 100%);
border-radius: 3px;
cursor: default;
box-shadow: 0px 0px 1px rgba(0,0,0,0.20);

&:active {
  border-color:#705ebb;
  background-image:-webkit-linear-gradient(
  #acc5e9 0%, 		#a3c0f2 18%, 
  #61a0ed 39%,		#55a3f2 70%, 
  #82c2f1 91.72%, 	#9AD2F2 100%); 
  box-shadow: 0px 0px 1px rgba(0,0,0,0.65);		
}

&:disabled {
  color: #999!important;
  background-image: -webkit-linear-gradient(#fbf8f8 0%, #f0f0f0 30%, #e3e3e3 45%, #d7d7d7 60%, #cbc9c9 100%);
}
` as any
Button.defaultProps = {
  p: 1, px: 2,
  bg: '#ccc',
  textAlign: 'center',
  minWidth: '1rem',
}