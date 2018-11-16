import CreateTenantInput from './dto/createTenantInput';
import GetTenantOutput from './dto/getTenantOutput';
import { GetAllTenantOutput } from './dto/getAllTenantOutput';
import UpdateTenantOutput from './dto/updateTenantOutput';
import { EntityDto } from 'src/services/dto/entityDto';
import { PagedResultDto } from 'src/services/dto/pagedResultDto';
import http from '../httpService';
import UpdateTenantInput from './dto/updateTenantInput';
import CreateTenantOutput from './dto/createTenantOutput';

class TenantService {
  public async create(createTenantInput: CreateTenantInput): Promise<CreateTenantOutput> {
    var result = await http.post('services/app/Tenant/Create', createTenantInput);
    console.log(result);
    return result.data;
  }

  public async delete(entityDto: EntityDto) {
    var result = await http.delete('services/app/Tenant/Delete1', { params: entityDto });
    console.log(result);
    return result.data;
  }

  public async get(entityDto: EntityDto): Promise<GetTenantOutput> {
    var result = await http.get('services/app/Tenant/Get', { params: entityDto });
    console.log(result);
    return result.data;
  }

  public async getAll(pagedFilterAndSortedRequest: PagedFilterAndSortedRequest): Promise<PagedResultDto<GetAllTenantOutput>> {
    var result = await http.get('services/app/Tenant/GetAll', { params: pagedFilterAndSortedRequest });
    console.log(result);
    return result.data.result;
  }

  public async update(updateTenantInput: UpdateTenantInput): Promise<UpdateTenantOutput> {
    var result = await http.get('services/app/Tenant/Update', { params: updateTenantInput });
    console.log(result);
    return result.data.result;
  }
}

export default new TenantService();
