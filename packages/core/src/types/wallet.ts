/* eslint-disable @typescript-eslint/no-explicit-any */
import { AssetList, Chain } from '@chain-registry/types';
import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdFee,
  StdSignDoc,
} from '@cosmjs/amino';
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate';
import {
  Algo,
  DirectSignResponse,
  EncodeObject,
  OfflineDirectSigner,
  OfflineSigner,
} from '@cosmjs/proto-signing';
import {
  DeliverTxResponse,
  SigningStargateClient,
  StargateClient,
} from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { IconType } from 'react-icons';

import { ChainWalletBase, MainWalletBase } from '../bases';
import { NameService } from '../name-service';
import { ChainName, ChainRecord } from './chain';
import { AppEnv, CosmosClientType, Data } from './common';

export type WalletName = string;

export enum WalletStatus {
  Disconnected = 'Disconnected',
  Connecting = 'Connecting',
  Connected = 'Connected',
  NotExist = 'NotExist',
  Rejected = 'Rejected',
  Error = 'Error',
}

export interface DownloadInfo extends AppEnv {
  icon: IconType;
  link: string;
}

export type WalletMode = 'extension' | 'wallet-connect';

export interface Metadata {
  name: string;
  description: string;
  url: string;
  icons: string[];
}

export interface Wallet {
  name: WalletName;
  prettyName: string;
  mode: WalletMode;
  mobileDisabled: boolean;
  rejectMessage?:
    | {
        source: string; // message from wallet app
        target?: string; // message stored in walletManager, default 'Request Rejected!'
      }
    | string; // message from wallet app
  rejectCode?: number; // code from wallet app
  connectEventNamesOnWindow?: string[];
  connectEventNamesOnClient?: string[];
  downloads?: DownloadInfo[];
  logo?: string;
}

export type Bech32Address = string;

export interface WalletAccount {
  address: Bech32Address;
  pubkey: Uint8Array;
  name?: string;
  algo?: Algo;
  isNanoLedger?: boolean;
}

export interface Key {
  readonly name: string;
  readonly algo: string;
  readonly pubKey: Uint8Array;
  readonly address: Uint8Array;
  readonly bech32Address: string;
  readonly isNanoLedger: boolean;
}

export interface SignOptions {
  readonly preferNoSetFee?: boolean;
  readonly preferNoSetMemo?: boolean;
  readonly disableBalanceCheck?: boolean;
}

export interface DirectSignDoc {
  /** SignDoc bodyBytes */
  bodyBytes?: Uint8Array | null;
  /** SignDoc authInfoBytes */
  authInfoBytes?: Uint8Array | null;
  /** SignDoc chainId */
  chainId?: string | null;
  /** SignDoc accountNumber */
  accountNumber?: Long | null;
}

export declare enum BroadcastMode {
  /** Return after tx commit */
  Block = 'block',
  /** Return after CheckTx */
  Sync = 'sync',
  /** Return right away */
  Async = 'async',
}

export interface WalletClient {
  getAccount: (chainId: string) => Promise<WalletAccount>;
  getOfflineSigner: (chainId: string) => Promise<OfflineSigner> | OfflineSigner;

  disconnect?: () => Promise<void>;
  on?: (type: string, listener: EventListenerOrEventListenerObject) => void;
  off?: (type: string, listener: EventListenerOrEventListenerObject) => void;
  enable?: (chainIds: string | string[]) => Promise<void>;
  addChain?: (chainInfo: ChainRecord) => Promise<void>;
  getOfflineSignerAmino?: (chainId: string) => OfflineAminoSigner;
  getOfflineSignerDirect?: (chainId: string) => OfflineDirectSigner;
  signAmino?: (
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ) => Promise<AminoSignResponse>;
  signDirect?: (
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ) => Promise<DirectSignResponse>;
  getEnigmaPubKey?: (chainId: string) => Promise<Uint8Array>;
  getEnigmaTxEncryptionKey?: (
    chainId: string,
    nonce: Uint8Array
  ) => Promise<Uint8Array>;
  enigmaEncrypt?: (
    chainId: string,
    contractCodeHash: string,
    msg: object
  ) => Promise<Uint8Array>;
  enigmaDecrypt?: (
    chainId: string,
    ciphertext: Uint8Array,
    nonce: Uint8Array
  ) => Promise<Uint8Array>;
  sendTx?: (
    chainId: string,
    tx: Uint8Array,
    mode: BroadcastMode
  ) => Promise<Uint8Array>;
}

export interface ChainWalletData extends Data {
  username?: string;
  address?: string;
  offlineSigner?: OfflineSigner;
}

export interface MainWalletData extends Data {
  username?: string;
}

export type WalletData = ChainWalletData & MainWalletData;
export type WalletAdapter = ChainWalletBase | MainWalletBase;

export interface IChainWallet {
  new (walletInfo: Wallet, chainInfo: ChainRecord): ChainWalletBase;
}

export type NameServiceName = string;

export interface NameServiceRegistry {
  name: NameServiceName;
  contract: string;
  chainName: ChainName;
  getQueryMsg: (address: Bech32Address) => any;
  slip173: string;
}

export interface ChainContext {
  // walletRepo: WalletRepo;
  // wallet: ChainWalletBase | undefined;

  chain: Chain;
  assets: AssetList | undefined;
  wallet: Wallet | undefined;
  logoUrl: string | undefined;
  address: string | undefined;
  username: string | undefined;
  message: string | undefined;
  status: WalletStatus;

  isWalletDisconnected: boolean;
  isWalletConnecting: boolean;
  isWalletConnected: boolean;
  isWalletRejected: boolean;
  isWalletNotExist: boolean;
  isWalletError: boolean;

  openView: () => void;
  closeView: () => void;
  connect: (wallet?: WalletName) => Promise<void>;
  disconnect: () => Promise<void>;
  getRpcEndpoint: () => Promise<string>;
  getRestEndpoint: () => Promise<string>;
  getStargateClient: () => Promise<StargateClient>;
  getCosmWasmClient: () => Promise<CosmWasmClient>;
  getSigningStargateClient: () => Promise<SigningStargateClient>;
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>;
  getNameService: () => Promise<NameService>;

  estimateFee: (
    messages: EncodeObject[],
    type?: CosmosClientType,
    memo?: string,
    multiplier?: number
  ) => Promise<StdFee>;
  sign: (
    messages: EncodeObject[],
    fee?: StdFee,
    memo?: string,
    type?: CosmosClientType
  ) => Promise<TxRaw>;
  broadcast: (
    signedMessages: TxRaw,
    type?: CosmosClientType
  ) => Promise<DeliverTxResponse>;
  signAndBroadcast: (
    messages: EncodeObject[],
    fee?: StdFee,
    memo?: string,
    type?: CosmosClientType
  ) => Promise<DeliverTxResponse>;

  // methods exposed from wallet client
  enable: (chainIds: string | string[]) => Promise<void>;
  getOfflineSigner: () => Promise<OfflineSigner>;
  getOfflineSignerAmino: () => OfflineAminoSigner;
  getOfflineSignerDirect: () => OfflineDirectSigner;
  signAmino: (
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ) => Promise<AminoSignResponse>;
  signDirect: (
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ) => Promise<DirectSignResponse>;
  sendTx(tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
}
