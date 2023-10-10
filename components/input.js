
export default function Input(props) {
    const onKeyPress = e => {
      // normalize the regpattern as a Regular expression
      const regpattern = props.regpattern instanceof RegExp ? props.regpattern : new RegExp(props.regpattern)
      
      // if the currently typed character is not in the regular expression, do not allow it (to be rendered)
      // if the length of the input will exceed, do not allow
      if( !regpattern.test(e.key) || e.target.value.length + 1 > (props.max||Infinity))
        e.preventDefault()
  
      // if also has "onKeyPress" prop, fire it now
      props.onKeyPress && props.onKeyPress(e) 
    }
    
    // prevent invalid content pasting
    const onPaste = e => {
      // get the regpattern with midifications for testig a whole string rather than a single character
      const regpattern = props.regpattern instanceof RegExp ? props.regpattern : new RegExp(`^${props.regpattern}+$`)
      
      // get pasted content as string
      const paste = (e.clipboardData || window.clipboardData).getData('Text')
      
      // vaildate
      if( !regpattern.test(paste) || paste.length > (props.max||Infinity))
        e.preventDefault()
        
      // if also has "onPaste" prop, fire it now
      props.onPaste && props.onPaste(e) 
    }
      
    return <input {...props} onKeyDown={onKeyPress} onPaste={onPaste} />
}

export { Input };
