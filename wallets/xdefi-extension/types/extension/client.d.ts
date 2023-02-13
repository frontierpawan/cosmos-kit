import { StdSignDoc } from '@cosmjs/amino';
import { Algo, OfflineDirectSigner } from '@cosmjs/proto-signing';
import { BroadcastMode } from '@cosmos-kit/core';
import { DirectSignDoc, SignOptions, WalletClient } from '@cosmos-kit/core';
import { XDEFI } from './types';
export declare class XDEFIClient implements WalletClient {
  readonly client: XDEFI;
  constructor(client: XDEFI);
  enable(chainIds: string | string[]): Promise<void>;
  disconnect(): Promise<void>;
  getAccount(
    chainId: string
  ): Promise<{
    name: string;
    address: string;
    algo: Algo;
    pubkey: Uint8Array;
  }>;
  getOfflineSigner(
    chainId: string
  ): Promise<import('@cosmjs/proto-signing').OfflineSigner>;
  getOfflineSignerAmino(
    chainId: string
  ): import('@cosmjs/amino').OfflineAminoSigner;
  getOfflineSignerDirect(chainId: string): OfflineDirectSigner;
  signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ): Promise<import('@cosmjs/amino').AminoSignResponse>;
  signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ): Promise<import('@cosmjs/proto-signing').DirectSignResponse>;
  sendTx(
    chainId: string,
    tx: Uint8Array,
    mode: BroadcastMode
  ): Promise<Uint8Array>;
}