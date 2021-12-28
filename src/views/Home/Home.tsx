import React, {useState} from 'react'
import styled from 'styled-components'
import Button from '../../components/Button'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Balances from './components/Balances'
import { Input } from '@material-ui/core';
import * as bsc from '@binance-chain/bsc-use-wallet'
import { useWallet } from 'use-wallet'
import BigNumber from 'bignumber.js'
import usePresale from '../../hooks/usePresale'
import { deposit, claim } from '../../presale/utils'
import { useMediaQuery } from 'react-responsive'
import Value from '../../components/Value'
import Countdown from 'react-countdown'
import ERC20ABI from '../../presale/lib/abi/presaleErc20.json'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import Binance from 'binance-api-node'
import mainImg from '../../assets/img/main.png'
import logoImg from '../../assets/img/icon.png'
import webBannerImg from '../../assets/img/webBanner.jpg'
import phoneBannerImg from '../../assets/img/phoneBanner.jpg'

const binance = Binance()

let startTime = new Date()
let endTime = new Date('03/23/2021 5:16')
let launchTime = Math.abs(startTime.getTime() - endTime.getTime())

const Home: React.FC = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)'
  })

  const [tokenPrice, setNum] = useState(10);
  const [deposited, setDeposited] = useState(0);
  const [claimable, setClaimable] = useState(0);

  const getBnbPrice = async () => {
    let ticker = await binance.prices({ symbol: 'BNBUSDT' })
    let price = Number(ticker['BNBUSDT'])
    setNum(price);

  }
  getBnbPrice()

  const { account }: { account: any } = bsc.useWallet()

  const wallet =  bsc.useWallet()

  let description = <div style={{textAlign:'center', fontSize:'26px', fontFamily: 'Optima', color: 'black', lineHeight:'48px', fontWeight:'bold'}}>
                    <span>Join The Presale</span>
                    </div>;

  const [leftTime, setCountTime] = useState(0)

  const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org/")); //https://speedy-nodes-nyc.moralis.io/1b8e53affad7184a2e65e738/bsc/mainnet
  const presaleContract = new web3.eth.Contract((ERC20ABI as unknown) as AbiItem, '0x475b3938CFe054f7ef5A0a1907970398D80e9c42');

  const getLeftTime = async () => {
    const leftTimeNum = await presaleContract.methods.getLeftTimeAmount().call();
    if (account){
      const dep = await presaleContract.methods.deposits(account).call();
      setDeposited(dep/1e18);
    }
    const c = await presaleContract.methods.isClaimable().call();
    setClaimable(c);
    setCountTime(new BigNumber(leftTimeNum).toNumber() * 1000);
  }
  getLeftTime();
  //setInterval( getLeftTime,1000);
  
  const [depositInput, setDepositNum] = useState(0)
  const [tokenAmountInput, setTokenAmountNum] = useState(0)

  const depositInputChange = (e : any) => {
    let depositVal = e.target.value;
    setDepositNum (depositVal);
    //setTokenAmountNum(depositVal /0.4);
  }
  const tokenInputChange = (e : any) => {
    let depositVal = e.target.value;
    setTokenAmountNum (depositVal);
    //setDepositNum (depositVal*0.4);
  }

  const presale = usePresale();

  const depositEther = () => {
    if ( !claimable )
      deposit(presale, account, depositInput);
    else
      claim(presale, account);
  };
  return (
    <div id = 'ddd' >
        <Page>        
          <div style={{ display: isDesktopOrLaptop? "grid" : "block"}}>
            {/* <div></div>
            <PageHeader
              icon={<img style={{marginLeft:'-35px', width: 150 }} src={mainImg} />}
              maintitle="Infinity"
              title="Infinity Farm"
              subtitle={wallet.account}
            /> */}
          </div>
          <div>
            <img style={{width: isDesktopOrLaptop?1072:'100%', borderRadius:'20px'}} src={isDesktopOrLaptop?webBannerImg:phoneBannerImg} />
          </div>
          <div style={{display: isDesktopOrLaptop?'flex':'block', width: isDesktopOrLaptop?1072:'auto', margin: isDesktopOrLaptop?"40px auto auto auto":"40px auto"}}>
            <StyledContainer>
              <h2 style={{color:'#1e90ff'}}>
                How to take part
              </h2>
              <h3>Before Pre-Sale:</h3>
              <ul>
                <li>Buy BNB, be sure to hae it ready in your Web-3 wallet in BSC network.</li>
                <li>Open the Presale link in your Web-3 Browser.</li>
                {/* <li>Wait for the Presale to start</li> */}
              </ul>
              <h3>During Pre-Sale:</h3>
              <ul>
                <li>While the sale is live, press the Buy button and input the amount of BNB</li>
                <li>Confirm the amount of BNB you want to invest</li>
                <li>Min amount 1 BNB</li>
                <li>Max amount 10 BNB</li>
              </ul>
              <h3>After SoftCap is reached:</h3>
              <ul>
                <li>1400$INFINITY will be distributed to wallets who joined the presale.</li>
              </ul>
              <h3>After Pre-Sale:</h3>
              <ul>
                <li>Token will be vested until January 12th</li>
              </ul>
              

            </StyledContainer>
            <StyledContainerR>
              <div style={{display:'flex', margin: 'auto'}}>
                <img width='150px' src={logoImg}/>
                <h2 style={{marginLeft:'40px'}}>$INFINITY</h2>
              </div>
              <div style={{display:'flex', justifyContent:'center', marginTop:'24px', marginBottom:'0'}}>
                {/*leftTime>0?'<Countdown date={Date.now() + leftTime} />': 'Finished'*/}
                <h2 style={{color:'#1e90ff'}}>{claimable?'Claiming': leftTime>0?'In progress':'Finished'}</h2>
              </div>
              <div style={{marginTop:'0px', padding:'0px 0', display:'grid', borderBottom:'1px solid rgba(0, 0, 0, 0.3)', }}>
                <span>Fixed Swap Ratio</span>
                <span className='boldFont'>1 INFINITY = 0.4 BNB</span>
              </div>
              <div style={{display:'flex'}}>
                <div className='priceState' style={{width:isDesktopOrLaptop?200:"50%"}}>
                  <span>BNB Price $</span>
                  <span className='boldFont'>
                    <Value
                      value={tokenPrice}
                    />
                  </span>
                </div>
                <div className='priceState' style={{margin:'auto 0 0 auto', width:isDesktopOrLaptop?200:"50%"}}>
                  <span>Maximum per wallet</span>
                  <span className='boldFont'>10 BNB</span>
                </div>
              </div>
              

              <div style={{display:'flex'}}>
                <div className='priceState' style={{width:isDesktopOrLaptop?200:"50%"}}>
                  <span>Your Balance</span>
                  <span className='boldFont'>
                  { account && 
                    <div>
                      <Value
                        value={new BigNumber(wallet.balance)
                            .div(new BigNumber(10).pow(18))
                            .toNumber()}
                      />
                    </div>
                  }
                  { !account &&
                    <span>0.00</span>
                  }
                  </span>
                </div>
                <div className='priceState' style={{margin:'auto 0 0 auto', width:isDesktopOrLaptop?200:"50%"}}>
                  <span >Deposited </span>
                  <span className='boldFont'> {account?deposited:'0.00'} BNB </span>
                </div>
              </div>
              
              <Balances />
              <Input type='number' disabled={claimable==1} onChange={depositInputChange} style={{width: '100%', color: '#AAAA0', marginTop: 20, marginBottom: 0, }} placeholder='BNB Amount' />
              {/* <Input type='number' onChange={tokenInputChange} style={{width: '100%', bottom: 10, color: 'black', marginTop: 30, marginBottom: 0, }} placeholder='Token Amount' /> */}
              <div style={{marginTop:'10px'}}>
                <Button disabled ={!account} text={claimable?"Claim":"Buy"} onClick={depositEther} variant="secondary" />
              </div>
            </StyledContainerR>
          </div>
      </Page>
    </div>
  )
}

const StyledContainer = styled.div`
  background-color: rgba(255,255,255,0.5);
  box-sizing: border-box;
  margin: 0px;
  max-width: 456px;
  width: 100%;
  padding: 20px;
  position: relative;
  border: 1px solid #FFFFFFF;
  border-radius: 20px;
  font-family: "Nunito";
  // box-shadow: 0 2px 8px 0 rgb(0 0 0 / 10%), 0 6px 20px 0 rgb(0 0 0 / 19%);
  @media (max-width: 767px) {
    width: auto;
    // padding: 0px;
    // left: 0;
  }
`
const StyledContainerR = styled.div`
  background-color: rgba(255,255,255,0.5);
  box-sizing: border-box;
  margin: 0px;
  max-width: 456px;
  width: 100%;
  padding: 20px;
  position: relative;
  border: 1px solid #FFFFFFF;
  border-radius: 20px;
  font-family: "Nunito";
  // box-shadow: 0 2px 8px 0 rgb(0 0 0 / 10%), 0 6px 20px 0 rgb(0 0 0 / 19%);
  margin: auto 0 0 auto;
  padding: 20px 20px;
  // background: linear-gradient(108.1deg, #b84c4f, #FFFFFFF 48.54%, #FFFFFFF);
  // background-color: #FFFFFFF;
  color: black;
  font-family: "Nunito";
  min-height: 475px;
  vertical-align: middle;
  @media (max-width: 767px) {
    margin-top:30px;
    padding: 48px 20px;
    // width: auto;
    // left: 0;
  }
`

export default Home
