import React from 'react';
import { RingLoader } from 'react-spinners';


const Spinner = () =>
    <div className="loadingtv"
         style={{ textAlign: '-webkit-center', marginTop: '200px'}}>
        <RingLoader
            color={'#123abc'}
            loading={true}
        />
    </div>

export default Spinner;