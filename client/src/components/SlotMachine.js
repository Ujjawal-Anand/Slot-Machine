import React, { useState, useEffect, useContext } from 'react';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/react-hooks';


import Reel from './Reel';
import {AuthContext} from '../context/authContext';
import { UPDATE_POINTS, ADD_COUPON, REDEEM_COUPON } from '../graphql/mutations';

import '../assets/styles/slot-style.css';

const SlotMachine = () => {
    const { state } = useContext(AuthContext);
    console.log(state)

    const [reels] = useState([
        Array.from({length: 9}, (_, i) => i+1),
        Array.from({length: 9}, (_, i) => i+1),
        Array.from({length: 9}, (_, i) => i+1)
    ]),

    [attempts, setAttempts] = useState(state.user.attempts),
    [spinError, setSpinError] = useState(false),
    [points, setPoints] = useState(state.user.points),
    [currentReel, setCurrentReel] = useState([{ index: 0}, {index: 0}, {index: 0}]),
    [spinner, setSpinner] = useState(true),
    [loading, setLoading] = useState(false),
    [visible, setVisible] = useState(false);

    const [updatePoints] = useMutation(UPDATE_POINTS, {
        onError: (err) => {
            toast.error(`Failed to save data $(err)`)
        }
    });

    const [addCoupon] = useMutation(ADD_COUPON, {
        onError: (err) => {
            toast.error(`Couldn't add coupon $(err)`)
        },
        onCompleted: ({coupon}) => {
            toast.success(`Coupon added successfully`);

        }
    });




    // this will show spinner animation in the beginning
    useEffect(() => {
        setLoading(true);
        const interval = setTimeout(() => {
            spin(false);
            setSpinner(false)
        }, 1000);
        setLoading(false);
        return () => clearInterval(interval);
    }, [reels])

    

    const spin = (updatePrize) => {
        const newCurrentReel = reels.map(reel => {
            const randomNum =  getRandomInt(6, reel.length)
            return {
                index: randomNum,
                name: reel[randomNum]
            }
        });
        console.log(newCurrentReel);

        if (updatePrize) {
            calculatePoints(newCurrentReel)
            updatePoints({ variables: { points: points } });
        }
        
        setCurrentReel(newCurrentReel)
    }

    const generateString = (length=5) => {
        return Math.random().toString(36).substring(length);
    }

    const handleSpin = () => {
        setLoading(true);
        const newAttempts = attempts-1;
        setSpinError(newAttempts === 0 ? true : false);
        setSpinner(true)

        const interval = setTimeout(() => {
            spin(true);
            setSpinner(false);
        }, 1000);
        return () => clearInterval(interval);
    }

    const calculatePoints = currentReel => {
        setLoading(false);  
        const reelsCount = currentReel.map(dataItem => dataItem.name);
        setAttempts(attempts-1);
        
        if(new Set(reelsCount).size === 1){
         setPoints(points+500); 
         return;
        } // numbers are equal;

        // calculate numbers are consucative or odd consucative or even consucative
        // in each case => 200 points
        const diffNum1 = reelsCount[2] - reelsCount[1];
        const diffNum2 = reelsCount[1] - reelsCount[0];
        if(diffNum1 === diffNum2 && (diffNum1 === 1 || diffNum1 === 2)) {
            setPoints(points+200);
            return;
        }

        // check for special combination => 1 5 9 => 50 points
        if(reelsCount[0] === 1 && reelsCount[1] === 5 && reelsCount[2] === 9) {
            setPoints(points+50);
            return;
        }

        setPoints(points+5);
    }

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max-1);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return (
            <div className="slot-container">
                <div className="account-info">
                    <p> {state.user.email.split('@')[0]} </p>
                    {points === 0 ? 
                    <p>You account has 0 prize points</p>
                        : <p>Total Points : {points}</p>}
                    {points >= 1000 && <button className='btn'>Redeem</button>}
                </div>
                <div className='coupons'>
                    <button className='btn' onClick={() => setVisible(true)}>My coupons</button>
                </div>
            <div className="slot">
                <h2 className="slot__heading">Slot Machine</h2>
                              
                <div className="slot__slot-container">
                    {reels.map((reelItem, index) => 
                        <Reel reelItem={reelItem} key={index} selectedReel={currentReel[index]} spinner={spinner} />
                    )}                   
                </div>

                { spinError &&  <span className="error">Game over. Add more attempts to play</span>}
                <button className="slot__spin-button" onClick={handleSpin} disabled={loading} >Spin</button>
                <div className='attempts'>You have {attempts} attempts remaining</div>
            </div>

            <Rodal
                visible={visible}
                onClose={() => setVisible(false)}
                animation='zoom'
                closeOnEsc
            >
                <div className="header">Rodal</div>
                <div className="body">A React modal with animations.</div>
                <button className="rodal-confirm-btn" onClick={() => setVisible(false)}>
                    ok
                </button>
                <button className="rodal-cancel-btn" onClick={() => setVisible(false)}>
                    close
                </button>
            </Rodal>
        </div>            
        
    )
}

export default SlotMachine;