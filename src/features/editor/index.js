import Timbre from './Timbre';
import Vocoder from './Vocoder';
import Effects from './Effects';
import Arpeggio from './Arpeggio';
import { useSelector } from 'react-redux';

const Editor = () => {
  const activeTab = useSelector((state) => state.parameters.activeTab);
  return (
    <div>
      {activeTab === 'Timbre1' ? <Timbre id='timbre1' /> : null}
      {activeTab === 'Timbre2' ? <Timbre id='timbre2' /> : null}
      {activeTab === 'Vocoder' ? <Vocoder id='vocoder' /> : null}
      {activeTab === 'Effects' ? <Effects id='effects' /> : null}
      {activeTab === 'Arpeggio' ? <Arpeggio id='arpeggio' /> : null}
    </div>
  );
};

export default Editor;
