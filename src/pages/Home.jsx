import React from 'react'
import { FaFolder } from 'react-icons/fa';
import { IoAccessibility } from 'react-icons/io5';
import Icon from '../components/Icon';

const Home = () => {
    return (
        <h1 class="text-black font-bold p-4 flex gap-2">
            <Icon name={'FaHome'} /> Home page 
        </h1>
    )
}

export default Home;