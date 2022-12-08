import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TextInput } from 'react-native';

import { useIsFocused } from '@react-navigation/native';

const SearchInput = (props) => {

    const isFocused = useIsFocused()

    const [debouncer, setDebouncer] = useState("");

    const searchInputRef = useRef();

    useEffect(() => {
        if (debouncer !== "") {
            props?.startLoading();
            const onChange = setTimeout(() => {
                props?.onChangeText(debouncer);
            }, props?.debounceTime || 1000)

            return () => clearTimeout(onChange)
        }
    }, [debouncer]);

    useEffect(() => {
        if (isFocused) {
            if (props?.autoFocus) {
                searchInputRef.current.focus();
            }
        }
    }, [isFocused]);

    return (
        <React.Fragment>
            <TextInput {...props} ref={searchInputRef} autoFocus={true} onChangeText={(value) => setDebouncer(value)} />
        </React.Fragment>
    )
}

export default SearchInput;

