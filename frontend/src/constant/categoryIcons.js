import { MdWhatshot, MdOutlinePool, MdBedroomParent } from "react-icons/md";
import { GiFamilyHouse, GiWoodCabin } from "react-icons/gi";
import { FaTreeCity } from "react-icons/fa6";
import { BiBuildingHouse } from "react-icons/bi";
import { IoBedOutline } from "react-icons/io5";
import { SiHomeassistantcommunitystore } from "react-icons/si";

export const categoryIcons = [
    {
        name: 'Trending',
        icon: MdWhatshot,
        category: 'trending',
    },
    {
        name: 'Villa',
        icon: GiFamilyHouse,
        category: 'villa',
    },
    {
        name: 'Farm House',
        icon: FaTreeCity,
        category: 'farmHouse',
    },
    {
        name: 'Pool House',
        icon: MdOutlinePool,
        category: 'poolHouse',
    },
    {
        name: 'Rooms',
        icon: MdBedroomParent,
        category: 'rooms',
    },
    {
        name: 'Flat',
        icon: BiBuildingHouse,
        category: 'flat',
    },
    {
        name: 'PG',
        icon: IoBedOutline,
        category: 'pg',
    },
    {
        name: 'Cabins',
        icon: GiWoodCabin,
        category: 'cabin',
    },
    {
        name: 'Shops',
        icon: SiHomeassistantcommunitystore,
        category: 'shops',
    },
];
