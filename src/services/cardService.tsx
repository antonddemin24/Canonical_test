import React, { useEffect, useState } from "react"

interface Card {
    index : number;
    title : string;
    author : string;
    type : string;
    category : string;
    day : number;
    month : number;
    year : number;
    link_img: string;
    link_title: string;
    link_author: string;
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


export const AsyncAwait = () => {
    const [users, setUsers] = useState([])

    const fetchData = async () => {
        const response = await fetch("https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json");
        const data = await response.json();
        setUsers(data);
        }

    useEffect(() => {
        fetchData()
        }, [])
    let index = 0;
    let cards : Card[] = [];
    for (const item in users) {
        index = ++index;
        const card : any = users[item]
        let cat : string;
        if (card['_embedded']['wp:term'][2].length === 0) {
            cat = 'Announcements'
        } else {
            cat = card['_embedded']['wp:term'][2][0]['name'];
        }
        cards.push({
            index: index,
            title: card['title']['rendered'], 
            author: card['_embedded']['author'][0]['name'],
            type: card['_embedded']['wp:term'][0][0]['name'],
            category: cat,
            day: +card['_end_day'],
            month: +card['_end_month'],
            year: +card['_end_year'],
            link_img: card['featured_media'],
            link_title: card['link'],
            link_author: card['_embedded']['author'][0]['link']
        });
    }
    //console.log(users)

    return ( 
        <div className="u-equal-height row">
            {cards.map(item =>
                <div className="col-4" key={item.index}>
                    <hr className="top-line" />
                    <div className="p-card--highlighted" >
                        <header className='p-card__header'>{item.category}</header>
                        <img src={item.link_img} className='p-card__image' alt="" />
                        <h3>
                            <a href={item.link_title}>{item.title}</a>
                        </h3>
                        <p className="">
                            <em>
                            by <a href={item.link_author}>{item.author}</a> on {item.day} {monthNames[item.month - 1]} {item.year}
                            </em>
                        </p>
                        <hr className="bottom-line"/>
                        <p className="p-card__content">{item.type}</p>
                    </div>
                </div>)}
        </div>

    )
}

