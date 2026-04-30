import { ReactComponent as MasterCard } from '../assets/flags/mastercard.svg';
import { ReactComponent as Visa } from '../assets/flags/visa.svg';
import { ReactComponent as Elo } from '../assets/flags/elo.svg';
import { ReactComponent as AmericanExpress } from '../assets/flags/americanexpress.svg';
import { ReactComponent as Hiper } from '../assets/flags/hiper.svg';
import { ReactComponent as HiperCard } from '../assets/flags/hipercard.svg';
import { ReactComponent as DinersClub } from '../assets/flags/dinersclub.svg';
import { ReactComponent as Discover } from '../assets/flags/discover.svg';
import { ReactComponent as Cabal } from '../assets/flags/cabal.svg';
import { ReactComponent as Banescard } from '../assets/flags/banescard.svg';
import { ReactComponent as Aura } from '../assets/flags/aura.svg';
import { ReactComponent as JCB } from '../assets/flags/jcb.svg';

const flags = {
	mastercard: MasterCard,
	visa: Visa,
	elo: Elo,
	americanexpress: AmericanExpress,
	hiper: Hiper,
	hipercard: HiperCard,
	dinersclub: DinersClub,
	discover: Discover,
	cabal: Cabal,
	banescard: Banescard,
	aura: Aura,
	jcb: JCB,
};

export const MAPPED_FLAGS = {
	Maestro: 'MasterCard',
	'Visa Electron': 'Visa',
};

export default flags;
