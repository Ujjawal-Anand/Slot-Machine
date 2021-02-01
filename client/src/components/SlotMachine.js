import React, { useState, useEffect, useContext } from 'react';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/react-hooks';
import TextModal from './TextModal';


import Reel from './Reel';
import {AuthContext} from '../context/authContext';
import { MIN_POINTS_TO_REDEEM, ATTEMPT_ON_REDEEM,
    POINTS_ON_EQUAL, POINTS_ON_CONSCUCATIVE, 
    POINTS_ON_UNIQUE, POINTS_IN_GENERAL } from '../constants';
import { UPDATE_POINTS, ADD_COUPON, REDEEM_COUPON} from '../graphql/mutations';

import '../assets/styles/slot-style.css';

const SlotMachine = () => {
    const { state } = useContext(AuthContext);
    console.log(state)

    const [reels] = useState([
        Array.from({length: 9}, (_, i) => i+1),
        Array.from({length: 9}, (_, i) => i+1),
        Array.from({length: 9}, (_, i) => i+1)
    ]),

     [accountInfo, setAccountInfo] = useState({totalPoints: state.user.points, 
                                                    coupons: state.user.coupons,
                                                    attempts: state.user.attempts}),

    [spinError, setSpinError] = useState(false),
    [coupon, setCoupon] = useState(''),
    [currentReel, setCurrentReel] = useState([{ index: 0}, {index: 0}, {index: 0}]),
    [spinner, setSpinner] = useState(true),
    [loading, setLoading] = useState(false),
    [visible, setVisible] = useState(false);

    

    const [updatePoints] = useMutation(UPDATE_POINTS, {
        onError: (err) => {
            toast.error(`Failed to save data ${err}`)
        },
        onCompleted: ({updatePoints}) => {
            const {points, coupons, attempts} = updatePoints;
            setAccountInfo({totalPoints: points, coupons, attempts })
        }
    });

    const [redeemCoupon] = useMutation(REDEEM_COUPON, {
        onError: (err) => {
            toast.error(`Failed to redeem coupon ${err}`)
        },
        onCompleted: ({coupon}) => {
            toast.success('Successfully Redeemed coupon')
        }
    });

    const [addCoupon] = useMutation(ADD_COUPON, {
        onError: (err) => {
            toast.error(`Couldn't add coupon ${err}`)
        },
        onCompleted: ({coupon}) => {
            toast.success(`Coupon added successfully`);
            setAccountInfo({points: accountInfo.points-MIN_POINTS_TO_REDEEM, ...accountInfo}) // change here
            setAccountInfo({coupons: [coupon, ...accountInfo.coupons], ...accountInfo});
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
            const randomNum =  getRandomInt(8, reel.length)
            return {
                index: randomNum,
                name: reel[randomNum]
            }
        });
        console.log(newCurrentReel);

        if (updatePrize) {
            updatePoints({ variables: { points: calculatePoints(newCurrentReel) } });
        }
        
        setCurrentReel(newCurrentReel)
    }

    const generateString = (length=5) => {
        return Math.random().toString(36).substring(3, length+3);
    }

    const handleSpin = () => {
        setLoading(true);
        setSpinError(accountInfo.attempts-1 === 0 ? true : false);
        setSpinner(true)

        const interval = setTimeout(() => {
            spin(true);
            setSpinner(false);
        }, 1000);
        return () => clearInterval(interval);
    }

    const  calculatePoints = currentReel => {
        setLoading(false);  
        const reelsCount = currentReel.map(dataItem => dataItem.name);
        
        if(new Set(reelsCount).size === 1){
         return POINTS_ON_EQUAL;
        } // numbers are equal;

        // calculate numbers are consucative or odd consucative or even consucative
        // in each case => 200 points
        const diffNum1 = reelsCount[2] - reelsCount[1];
        const diffNum2 = reelsCount[1] - reelsCount[0];
        if(diffNum1 === diffNum2 && (diffNum1 === 1 || diffNum1 === 2)) {
            return POINTS_ON_CONSCUCATIVE;
        }

        // check for special combination => 1 5 9 => 50 points
        if(reelsCount[0] === 1 && reelsCount[1] === 5 && reelsCount[2] === 9) {
            return POINTS_ON_UNIQUE;
        }
        return POINTS_IN_GENERAL;
    }

    const showNewCoupon = () => {
        setCoupon(generateString());
        setVisible(true);
    }

    const createCoupon = () => {
        addCoupon({ variables: { coupon: coupon } });
        setVisible(false);
    }

    const handleRedeemCoupon = () => {
        redeemCoupon({ variables: { coupon: coupon } });
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
                    {accountInfo.totalPoints === 0 ? 
                    <p>You account has 0 prize points</p>
                        : <p>Total Points : {accountInfo.totalPoints}</p>}
                    {accountInfo.totalPoints >= 1000 && <button className='btn'>Redeem</button>}
                </div>
                <div className='coupons'>
                    <button className='btn' onClick={showNewCoupon}>My coupons</button>
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
                <div className='attempts'>You have {accountInfo.attempts} attempts remaining</div>
            </div>

            <Rodal
                visible={visible}
                onClose={() => setVisible(false)}
                animation='zoom'
                closeOnEsc
            >
                <div className="header">Available Coupons</div>
                <div className="body">
                    {/* {coupons.length === 0 ? <p>No Coupons</p> : coupons.map(coupon => <p>{coupon}</p>)} */}
                    {/* <h6>Congratulation</h6>
                    <p>Here is your voucher</p>
                    <h5>{coupon}</h5>  */}

            <h2>Redeem Coupon</h2>
                <div className="form-group">
            <label>Enter Coupon:</label>
            <input
              type="text"
              value={coupon}
              name="modalInputName"
              onChange={e => setCoupon(e.target.value)}
              className="form-control"
            />
          </div>    
                
                <button className="rodal-confirm-btn" onClick={handleRedeemCoupon}>
                    ok
                </button>
                <button className="rodal-cancel-btn" onClick={() => setVisible(false)}>
                    close
                </button>
                </div>
            </Rodal>
        </div>            
        
    )
}

export default SlotMachine;