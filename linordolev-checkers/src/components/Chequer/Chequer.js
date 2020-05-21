import React from 'react';
import './Chequer.css';
import Piece from '../Piece/Piece';

const Chequer = props => {
    const {piece, chequer, glow} = props;
    let glowClass = '';
    const hasPiece = piece !== null;
    let onClick = () => {}
    if(hasPiece){
        onClick = () => chequer.onSelectChequer(chequer.i, chequer.j);
    }else if(glow){
        glowClass = 'Glow';
        onClick = () => chequer.onMoveHere(chequer.i, chequer.j)
    }
    
    return(
        <div className={'Chequer ' + chequer.chequerColor + ' ' + glowClass}
             onClick={onClick}>
        {hasPiece && <Piece piece={piece}/>}
        </div>
    );
};
export default Chequer;