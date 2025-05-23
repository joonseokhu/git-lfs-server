import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  StreamableFile,
} from '@nestjs/common';
import { Request } from 'express';
import { BatchRequest, VerifyRequest } from './dto';
import { GitLFSBatchService } from './git-lfs-batch.service';
import { GitLFSService } from './git-lfs.service';

@Controller('lfs/:user/:repo/objects')
export class GitLFSController {
  constructor(
    private readonly lfsService: GitLFSService,
    private readonly batchService: GitLFSBatchService,
  ) {}

  @HttpCode(200)
  @Header('Content-Type', 'application/vnd.git-lfs+json')
  @Post('batch')
  async batchObject(
    @Param('user') user: string,
    @Param('repo') repo: string,
    @Body() batchRequest: BatchRequest,
  ) {
    return this.batchService.batchObject(user, repo, batchRequest);
  }

  // @Post('locks')
  // async createLock(
  //   @Param('user') user: string,
  //   @Param('repo') repo: string,
  //   @Body() batchRequest: BatchRequest,
  // ) {
  //   return this.batchService.batchObject(user, repo, batchRequest);
  // }

  @Post('verify')
  async verifyObject(
    @Param('user') user: string,
    @Param('repo') repo: string,
    @Body() verifyRequest: VerifyRequest,
  ): Promise<void> {
    await this.lfsService.verifyObject(
      user,
      repo,
      verifyRequest.oid,
      verifyRequest.size,
    );
  }

  @Get(':oid')
  async downloadObject(
    @Param('user') user: string,
    @Param('repo') repo: string,
    @Param('oid') oid: string,
  ) {
    const size = await this.lfsService.getSize(user, repo, oid);
    const stream = await this.lfsService.downloadObject(user, repo, oid);
    return new StreamableFile(stream, { length: size });
  }

  @Put(':oid')
  uploadObject(
    @Param('user') user: string,
    @Param('repo') repo: string,
    @Param('oid') oid: string,
    @Req() request: Request,
  ) {
    return this.lfsService.uploadObject(user, repo, oid, request);
  }
}
