import React from 'react';
import * as Ri from 'react-icons/ri'; //Remix Icons 
import * as Md from 'react-icons/md'; //Material Icons
import * as Io from 'react-icons/io5'; //Ion Icons
import * as Gi from 'react-icons/gi';
import * as Pi from 'react-icons/pi';
import * as Go from 'react-icons/go'
import * as Ci from 'react-icons/ci';
import * as Gr from 'react-icons/gr';
import * as Fa from 'react-icons/fa';
import * as Tb from 'react-icons/tb';
import * as Ti from 'react-icons/ti';
import * as Hi from 'react-icons/hi';
// Import other icon sets as needed

const iconLibraries = {
    Ri, Md, Io, Gi, Pi, Go, Ci, Gr, Fa, Tb, Ti, Hi, Fa
};

const Icon = ({ name, size = 24, color = 'blue', style = {} }) => {

    const prefix = name?.slice(0, 2);
    const IconComponent = iconLibraries[prefix]?.[name];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found`);
        return null;
    }

    return <IconComponent size={size} color={color} style={style} />;
};

export default Icon;