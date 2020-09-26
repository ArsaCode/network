import React from 'react';

export default function Pagination({totalPosts, postsPerPage, switchPage}) {
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(totalPosts/postsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="container">
            <ul className="pagination">
                {pageNumbers.map(pageNb => (
                    <li key={pageNb} className="page-item">
                        <button className="page-link" onClick={(event) => switchPage(event, pageNb)}>{pageNb}</button>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
