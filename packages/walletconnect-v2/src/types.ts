import { Algo } from '@cosmjs/amino';
import { ChainRecord, Wallet } from '@cosmos-kit/core';
import SignClient from '@walletconnect/sign-client';

import { ChainWCV2 } from './chain-wallet';
import { WCClientV2 } from './client';

export interface IChainWCV2 {
  new (walletInfo: Wallet, chainInfo: ChainRecord): ChainWCV2;
}

export interface IWCClientV2 {
  new (signClient: SignClient): WCClientV2;
}

export interface WCAccount {
  algo: Algo;
  address: string;
  pubkey: string;
  isNanoLedger?: boolean;
}
