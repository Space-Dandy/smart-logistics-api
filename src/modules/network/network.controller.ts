import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateNetworkDto } from './dto/create-netowrk.dto';
import { NetworkResponseDto } from './dto/network-response.dto';
import { NetworkService } from './network.service';

@ApiTags('network')
@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a network' })
  @ApiResponse({
    status: 201,
    description: 'The network has been successfully uploaded.',
    type: NetworkResponseDto,
  })
  async uploadNetwork(
    @Body() CreateNetworkDto: CreateNetworkDto,
  ): Promise<NetworkResponseDto> {
    return this.networkService.uploadNetwork(CreateNetworkDto);
  }

  @Get('nodes/:id')
  @ApiOperation({ summary: 'Get nodes of a network' })
  @ApiResponse({
    status: 200,
    description: 'List of node IDs in the network.',
    type: [String],
  })
  async getNodes(networkId: string): Promise<string[]> {
    return this.networkService.getNodes(networkId);
  }
}
