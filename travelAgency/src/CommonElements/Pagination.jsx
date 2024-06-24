import React from 'react';
import { Pagination } from 'react-bootstrap';

const CustomPagination = ({ totalUsers, usersPerPage, setTheCurrentPage, currentPage }) => {
  let pages = [];
  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pages.push(i);
  }

  return (
    <Pagination className='custom-pagination'>
      <Pagination.Prev
        onClick={() => setTheCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {pages.map((page, idx) => (
        <Pagination.Item
          key={idx}
          active={page === currentPage}
          onClick={() => setTheCurrentPage(page)}
        >
          {page}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => setTheCurrentPage(currentPage + 1)}
        disabled={currentPage === Math.ceil(totalUsers / usersPerPage)}
      />
    </Pagination>
  );
};

export default CustomPagination;
