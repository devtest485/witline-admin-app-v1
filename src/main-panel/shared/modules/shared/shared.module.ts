import { NgModule } from '@angular/core';
// NG-ZORRO imports
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { icons } from '../../../../app/icons-provider';

@NgModule({
  declarations: [],
  imports: [
    // NG-ZORRO modules
    NzButtonModule,
    NzCardModule,
    NzGridModule,
    NzListModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzCheckboxModule,
    NzRadioModule,
    NzSwitchModule,
    NzModalModule,
    NzDrawerModule,
    NzTabsModule,
    NzStepsModule,
    NzSpinModule,
    NzPaginationModule,
    NzBadgeModule,
    NzTagModule,
    NzDividerModule,
    NzTypographyModule,
    NzSpaceModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule.forRoot(icons),
    NzToolTipModule,
    NzPopconfirmModule,
    NzDropDownModule,
    NzSegmentedModule,
    NzCollapseModule,
  ]
})
export class SharedModule { }
