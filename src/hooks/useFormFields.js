import { useState } from 'react';

export const useFormFields = (initialState) => {
    const [fields, setValues] = useState(initialState);

    return [
        fields,
        function(event) {
            const target = event.target;
            setValues({
                ...fields,
                [target.name]: target.value
            });
        }
    ];
}