import React from 'react';
import './Board.css';
import Chequer from '../Chequer/Chequer';
import {Row,Col} from 'react-bootstrap';

const Board = props => {
     return(
        <div className='Board'>
             {props.boardGame.map((row, index) => 
                 (<Row key={index} noGutters>
                 {row.map((chequer, index) => (<Col key={index}>
                                            <Chequer 
                                                    chequer={chequer.chequer} 
                                                    piece={chequer.piece}
                                                    glow={chequer.glow}
                                            />
                                        </Col>))}
                 </Row>)
             )}
        </div>  
     );
   
};
export default Board;
