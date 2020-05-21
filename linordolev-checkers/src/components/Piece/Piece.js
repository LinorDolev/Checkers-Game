import React from 'react';
import './Piece.css';

const Piece = props => {
    const {pieceColor, king} = props.piece;
    let kingClassName = king ? 'King' : '';
    return(
        <div>
            <img alt="" className={'Piece ' + pieceColor + kingClassName}/>
        </div>
    );
};
export default Piece;